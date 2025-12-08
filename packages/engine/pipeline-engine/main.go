package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/api/types/volume"
	"github.com/docker/docker/client"
	"gopkg.in/yaml.v3"
)

// ============================================================================
// TYPES - Keep it simple, just what we need
// ============================================================================

type Config struct {
	Languages map[string]string `yaml:"languages"`
}

type Pipeline struct {
	Nodes []Node `json:"nodes"`
	Edges []Edge `json:"edges"`
}

type Node struct {
	ID   string   `json:"id"`
	Type string   `json:"type"`
	Data NodeData `json:"data"`
}

type NodeData struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Executable  Executable `json:"executable"`
}

type Executable struct {
	Language string `json:"language"`
	Code     string `json:"code"`
}

type Edge struct {
	ID     string `json:"id"`
	Source string `json:"source"`
	Target string `json:"target"`
}

// ============================================================================
// MAIN - Everything happens here
// ============================================================================

func main() {
	// Check args
	if len(os.Args) < 2 {
		log.Fatal("Usage: go run main.go <pipeline.json>")
	}
	pipelineFile := os.Args[1]

	// 1. Load config
	fmt.Println("Loading config...")
	config := loadConfig("config.yaml")

	// 2. Parse pipeline
	fmt.Println("Parsing pipeline...")
	pipeline := loadPipeline(pipelineFile)
	executionOrder := buildExecutionOrder(pipeline)

	fmt.Printf("Found %d nodes to execute\n", len(executionOrder))

	// 3. Create Docker client
	ctx := context.Background()
	docker, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		log.Fatalf("Failed to create Docker client: %v", err)
	}
	defer docker.Close()

	// 4. Create shared volume
	fmt.Println("Creating shared volume...")
	volumeName := "pipeline-shared-" + generateID()
	_, err = docker.VolumeCreate(ctx, volume.CreateOptions{Name: volumeName})
	if err != nil {
		log.Fatalf("Failed to create volume: %v", err)
	}
	defer func() {
		fmt.Println("Cleaning up volume...")
		if err := docker.VolumeRemove(ctx, volumeName, true); err != nil {
			fmt.Printf("Warning: Failed to remove volume: %v\n", err)
		}
	}()

	// 5. Run pipeline
	containerCache := make(map[string]string) // language -> containerID
	defer func() {
		// Cleanup containers
		fmt.Println("Cleaning up containers...")
		for lang, containerID := range containerCache {
			fmt.Printf("  Stopping %s container...\n", lang)
			timeout := 5
			if err := docker.ContainerStop(ctx, containerID, container.StopOptions{Timeout: &timeout}); err != nil {
				fmt.Printf("  Warning: Failed to stop container: %v\n", err)
			}
			if err := docker.ContainerRemove(ctx, containerID, container.RemoveOptions{Force: true}); err != nil {
				fmt.Printf("  Warning: Failed to remove container: %v\n", err)
			}
		}
	}()

	var previousNodeID string
	for _, node := range executionOrder {
		fmt.Printf("Running node %s (%s)...\n", node.ID, node.Data.Title)

		lang := node.Data.Executable.Language
		code := node.Data.Executable.Code

		// Get or create container for this language
		containerID, exists := containerCache[lang]
		if !exists {
			image := config.Languages[lang]
			if image == "" {
				log.Fatalf("Unknown language: %s", lang)
			}

			// Pull image
			fmt.Printf("  Pulling image %s...\n", image)
			pullImage(ctx, docker, image)

			// Create container
			fmt.Printf("  Creating %s container...\n", lang)
			containerID = createContainer(ctx, docker, image, lang, volumeName)
			containerCache[lang] = containerID

			// Start container
			if err := docker.ContainerStart(ctx, containerID, container.StartOptions{}); err != nil {
				log.Fatalf("Failed to start container: %v", err)
			}
		}

		// Execute code in container
		output, err := executeCode(ctx, docker, containerID, lang, code, node.ID, previousNodeID)
		if err != nil {
			log.Fatalf("Node %s failed: %v", node.ID, err)
		}

		if output != "" {
			fmt.Printf("  Output: %s\n", truncate(output, 200))
		}

		fmt.Printf("✓ Node %s completed\n", node.ID)
		previousNodeID = node.ID
	}

	fmt.Println("\n🎉 Pipeline completed successfully!")
}

// ============================================================================
// HELPERS - Simple functions, no interfaces
// ============================================================================

func loadConfig(path string) Config {
	data, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("Failed to read config: %v", err)
	}
	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		log.Fatalf("Failed to parse config: %v", err)
	}
	return config
}

func loadPipeline(path string) Pipeline {
	data, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("Failed to read pipeline: %v", err)
	}
	var pipeline Pipeline
	if err := json.Unmarshal(data, &pipeline); err != nil {
		log.Fatalf("Failed to parse pipeline: %v", err)
	}
	return pipeline
}

func buildExecutionOrder(pipeline Pipeline) []Node {
	// Build adjacency map from edges
	nextNode := make(map[string]string) // source -> target
	for _, edge := range pipeline.Edges {
		nextNode[edge.Source] = edge.Target
	}

	// Build node lookup
	nodeByID := make(map[string]Node)
	var startNodeID string
	for _, node := range pipeline.Nodes {
		nodeByID[node.ID] = node
		if node.Type == "start" {
			startNodeID = node.ID
		}
	}

	if startNodeID == "" {
		log.Fatal("No start node found in pipeline")
	}

	// Walk the graph from start to end
	var order []Node
	currentID := startNodeID
	visited := make(map[string]bool)

	for currentID != "" {
		if visited[currentID] {
			log.Fatal("Cycle detected in pipeline")
		}
		visited[currentID] = true

		node := nodeByID[currentID]

		// Skip start and end nodes, only include task nodes
		if node.Type == "task" {
			order = append(order, node)
		}

		currentID = nextNode[currentID]
	}

	return order
}

func allNodes(pipeline Pipeline) func(func(Node) bool) {
	return func(yield func(Node) bool) {
		for _, node := range pipeline.Nodes {
			if !yield(node) {
				return
			}
		}
	}
}

func pullImage(ctx context.Context, docker *client.Client, imageName string) {
	reader, err := docker.ImagePull(ctx, imageName, image.PullOptions{})
	if err != nil {
		log.Fatalf("Failed to pull image %s: %v", imageName, err)
	}
	defer reader.Close()
	// Consume the output to complete the pull
	if _, err := io.Copy(io.Discard, reader); err != nil {
		log.Fatalf("Failed to pull image %s: %v", imageName, err)
	}
}

func createContainer(ctx context.Context, docker *client.Client, image, lang, volumeName string) string {
	// Determine the command to keep container alive
	var cmd []string
	switch lang {
	case "go":
		cmd = []string{"sh", "-c", "while true; do sleep 3600; done"}
	default:
		cmd = []string{"tail", "-f", "/dev/null"}
	}

	hostConfig := &container.HostConfig{
		Mounts: []mount.Mount{
			{
				Type:   mount.TypeVolume,
				Source: volumeName,
				Target: "/shared",
			},
		},
	}

	resp, err := docker.ContainerCreate(ctx,
		&container.Config{
			Image:      image,
			Cmd:        cmd,
			WorkingDir: "/shared",
			Tty:        false,
		},
		hostConfig,
		nil,
		nil,
		fmt.Sprintf("pipeline-%s-%s", lang, generateID()),
	)
	if err != nil {
		log.Fatalf("Failed to create container: %v", err)
	}
	return resp.ID
}

func executeCode(ctx context.Context, docker *client.Client, containerID, lang, code, nodeID, previousNodeID string) (string, error) {
	// Build the execution command based on language
	var execCmd []string

	// Skip if no code provided
	if code == "" {
		return "No code to execute", nil
	}

	switch lang {
	case "python":
		// Write code to file and execute (handles multiline better)
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/script.py << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\npython /tmp/script.py", code)}
	case "javascript", "typescript":
		// Write code to file and execute
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/script.js << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\nnode /tmp/script.js", code)}
	case "go":
		// For Go, write to file and run
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/main.go << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\ngo run /tmp/main.go", code)}
	case "ruby":
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/script.rb << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\nruby /tmp/script.rb", code)}
	case "rust":
		// For Rust, write, compile and run
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/main.rs << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\nrustc /tmp/main.rs -o /tmp/main && /tmp/main", code)}
	default:
		return "", fmt.Errorf("unsupported language: %s", lang)
	}

	// Create exec
	execConfig := container.ExecOptions{
		Cmd:          execCmd,
		AttachStdout: true,
		AttachStderr: true,
		WorkingDir:   "/shared",
	}

	execResp, err := docker.ContainerExecCreate(ctx, containerID, execConfig)
	if err != nil {
		return "", fmt.Errorf("failed to create exec: %w", err)
	}

	// Attach and run
	attachResp, err := docker.ContainerExecAttach(ctx, execResp.ID, container.ExecStartOptions{})
	if err != nil {
		return "", fmt.Errorf("failed to attach exec: %w", err)
	}
	defer attachResp.Close()

	// Read output
	output, err := io.ReadAll(attachResp.Reader)
	if err != nil {
		return "", fmt.Errorf("failed to read output: %w", err)
	}

	// Check exit code
	inspect, err := docker.ContainerExecInspect(ctx, execResp.ID)
	if err != nil {
		return "", fmt.Errorf("failed to inspect exec: %w", err)
	}

	if inspect.ExitCode != 0 {
		return "", fmt.Errorf("command failed with exit code %d: %s", inspect.ExitCode, string(output))
	}

	return cleanOutput(string(output)), nil
}

func cleanOutput(s string) string {
	// Remove Docker stream header bytes if present
	// Docker multiplexes stdout/stderr with 8-byte headers
	s = strings.TrimSpace(s)

	// Skip Docker stream header bytes (first 8 bytes per stream chunk)
	// Header format: [STREAM_TYPE, 0, 0, 0, SIZE1, SIZE2, SIZE3, SIZE4]
	result := make([]rune, 0, len(s))
	skipNext := 0
	for i, r := range s {
		// Skip first character if it looks like a Docker stream header byte
		if i == 0 && r < 32 {
			continue
		}
		if skipNext > 0 {
			skipNext--
			continue
		}
		// Skip control characters but keep printable ones
		if r >= 32 || r == '\n' || r == '\t' || r == '\r' {
			result = append(result, r)
		}
	}
	return strings.TrimSpace(string(result))
}

func truncate(s string, maxLen int) string {
	s = strings.TrimSpace(s)
	s = strings.ReplaceAll(s, "\n", " ")
	if len(s) > maxLen {
		// Handle UTF-8 properly with runes
		runes := []rune(s)
		if len(runes) > maxLen {
			return string(runes[:maxLen]) + "..."
		}
		return s
	}
	return s
}

func generateID() string {
	// Use process ID for simple, unique ID generation
	// Suitable for this use case where we're not running multiple instances
	return fmt.Sprintf("%d", os.Getpid())
}
