package executor

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/api/types/volume"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"

	"pipeline-engine/internal/types"
)

type Executor struct {
	client         *client.Client
	config         types.Config
	volumeName     string
	containerCache map[string]string
	dataFlowFile   *os.File
}

func New(cfg types.Config) (*Executor, error) {
	docker, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create docker client: %w", err)
	}

	file, err := os.Create("data_flow.txt")
	if err != nil {
		return nil, fmt.Errorf("failed to create data_flow.txt: %w", err)
	}

	header := fmt.Sprintf("ORBITIUM PIPELINE DATA FLOW LOG\nGenerated: %s\n%s\n\n",
		time.Now().Format("2006-01-02 15:04:05"),
		strings.Repeat("=", 60))
	file.WriteString(header)

	return &Executor{
		client:         docker,
		config:         cfg,
		containerCache: make(map[string]string),
		dataFlowFile:   file,
	}, nil
}

func (e *Executor) Setup(ctx context.Context) error {
	e.volumeName = "pipeline-shared-" + generateID()
	_, err := e.client.VolumeCreate(ctx, volume.CreateOptions{Name: e.volumeName})
	if err != nil {
		return fmt.Errorf("failed to create volume: %w", err)
	}
	return nil
}

// FinalizeOutput writes the completion message to data_flow.txt and closes it.
// This should be called BEFORE emitting the "done" status so the backend can read the file immediately.
func (e *Executor) FinalizeOutput() {
	if e.dataFlowFile != nil {
		e.dataFlowFile.WriteString(fmt.Sprintf("\n%s\nPIPELINE COMPLETED: %s\n",
			strings.Repeat("=", 60),
			time.Now().Format("2006-01-02 15:04:05")))
		e.dataFlowFile.Sync() // Ensure data is flushed to disk
		e.dataFlowFile.Close()
		e.dataFlowFile = nil
	}
}

// Cleanup stops and removes containers, then cleans up the volume.
// Can be run in a goroutine for background cleanup after output is finalized.
func (e *Executor) Cleanup(ctx context.Context) {
	for lang, containerID := range e.containerCache {
		fmt.Printf("  Stopping %s container...\n", lang)
		timeout := 5
		e.client.ContainerStop(ctx, containerID, container.StopOptions{Timeout: &timeout})
		e.client.ContainerRemove(ctx, containerID, container.RemoveOptions{Force: true})
	}

	if e.volumeName != "" {
		fmt.Println("Cleaning up volume...")
		e.client.VolumeRemove(ctx, e.volumeName, true)
	}

	e.client.Close()
}

func (e *Executor) Run(ctx context.Context, nodes []types.Node) error {
	var previousNodeID string

	for _, node := range nodes {
		e.emitStatus("running", node.ID, node.Data.Title, "")
		fmt.Printf("Running node %s (%s)...\n", node.ID, node.Data.Title)

		lang := node.Data.Executable.Language
		code := node.Data.Executable.Code

		containerID, exists := e.containerCache[lang]
		if !exists {
			img := e.config.Languages[lang]
			if img == "" {
				return fmt.Errorf("unknown language: %s", lang)
			}

			fmt.Printf("  Pulling image %s...\n", img)
			if err := e.pullImage(ctx, img); err != nil {
				return err
			}

			fmt.Printf("  Creating %s container...\n", lang)
			var err error
			containerID, err = e.createContainer(ctx, img, lang)
			if err != nil {
				return err
			}
			e.containerCache[lang] = containerID

			if err := e.client.ContainerStart(ctx, containerID, container.StartOptions{}); err != nil {
				return fmt.Errorf("failed to start container: %w", err)
			}
		}

		output, err := e.executeCode(ctx, containerID, lang, code)
		if err != nil {
			return fmt.Errorf("node %s failed: %w", node.ID, err)
		}

		e.logNodeOutput(node, lang, output)

		if output != "" {
			fmt.Printf("  Output: %s\n", truncate(output, 200))
		}

		e.emitStatus("completed", node.ID, node.Data.Title, truncate(output, 500))
		fmt.Printf("✓ Node %s completed\n", node.ID)
		previousNodeID = node.ID
		_ = previousNodeID
	}

	// Finalize output file BEFORE emitting done - this ensures the backend can read it immediately
	e.FinalizeOutput()
	e.emitStatus("done", "", "Pipeline completed", "")
	return nil
}

var ansiRegex = regexp.MustCompile(`\x1b\[[0-9;]*[a-zA-Z]|\x1b\][^\x07]*\x07|[\x00-\x08\x0b\x0c\x0e-\x1f]`)

func (e *Executor) emitStatus(status, nodeID, title, output string) {
	statusJSON := fmt.Sprintf(`{"status":"%s","nodeId":"%s","title":"%s","output":"%s"}`,
		status, nodeID, title, strings.ReplaceAll(output, `"`, `\"`))
	fmt.Fprintln(os.Stderr, "STATUS:"+statusJSON)
}

func (e *Executor) logNodeOutput(node types.Node, lang, output string) {
	clean := ansiRegex.ReplaceAllString(output, "")
	e.dataFlowFile.WriteString(fmt.Sprintf("Output:\n%s\n\n", clean))
}

func (e *Executor) pullImage(ctx context.Context, imageName string) error {
	reader, err := e.client.ImagePull(ctx, imageName, image.PullOptions{})
	if err != nil {
		return fmt.Errorf("failed to pull image %s: %w", imageName, err)
	}
	defer reader.Close()
	_, err = io.Copy(io.Discard, reader)
	return err
}

func (e *Executor) createContainer(ctx context.Context, img, lang string) (string, error) {
	var cmd []string
	switch lang {
	case "go":
		cmd = []string{"sh", "-c", "while true; do sleep 3600; done"}
	default:
		cmd = []string{"tail", "-f", "/dev/null"}
	}

	resp, err := e.client.ContainerCreate(ctx,
		&container.Config{
			Image:      img,
			Cmd:        cmd,
			WorkingDir: "/shared",
			Tty:        false,
		},
		&container.HostConfig{
			Mounts: []mount.Mount{
				{
					Type:   mount.TypeVolume,
					Source: e.volumeName,
					Target: "/shared",
				},
			},
		},
		nil,
		nil,
		fmt.Sprintf("pipeline-%s-%s", lang, generateID()),
	)
	if err != nil {
		return "", fmt.Errorf("failed to create container: %w", err)
	}

	return resp.ID, nil
}

func (e *Executor) executeCode(ctx context.Context, containerID, lang, code string) (string, error) {
	if code == "" {
		return "No code to execute", nil
	}

	var execCmd []string
	switch lang {
	case "python":
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/script.py << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\npython /tmp/script.py", code)}
	case "javascript", "typescript":
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/script.js << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\nnode /tmp/script.js", code)}
	case "go":
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/main.go << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\ngo run /tmp/main.go", code)}
	case "ruby":
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/script.rb << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\nruby /tmp/script.rb", code)}
	case "rust":
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/main.rs << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\nrustc /tmp/main.rs -o /tmp/main && /tmp/main", code)}
	case "r":
		execCmd = []string{"sh", "-c", fmt.Sprintf("cat > /tmp/script.R << 'ENDOFSCRIPT'\n%s\nENDOFSCRIPT\nRscript /tmp/script.R", code)}
	default:
		return "", fmt.Errorf("unsupported language: %s", lang)
	}

	execResp, err := e.client.ContainerExecCreate(ctx, containerID, container.ExecOptions{
		Cmd:          execCmd,
		AttachStdout: true,
		AttachStderr: true,
		WorkingDir:   "/shared",
	})
	if err != nil {
		return "", fmt.Errorf("failed to create exec: %w", err)
	}

	attachResp, err := e.client.ContainerExecAttach(ctx, execResp.ID, container.ExecStartOptions{})
	if err != nil {
		return "", fmt.Errorf("failed to attach exec: %w", err)
	}
	defer attachResp.Close()

	var stdout, stderr bytes.Buffer
	_, err = stdcopy.StdCopy(&stdout, &stderr, attachResp.Reader)
	if err != nil {
		return "", fmt.Errorf("failed to read output: %w", err)
	}

	inspect, err := e.client.ContainerExecInspect(ctx, execResp.ID)
	if err != nil {
		return "", fmt.Errorf("failed to inspect exec: %w", err)
	}

	output := stdout.String()
	if stderr.Len() > 0 {
		output += "\n" + stderr.String()
	}

	if inspect.ExitCode != 0 {
		return "", fmt.Errorf("command failed with exit code %d: %s", inspect.ExitCode, output)
	}

	return cleanOutput(output), nil
}

func cleanOutput(s string) string {
	s = strings.TrimSpace(s)
	result := make([]rune, 0, len(s))
	for i, r := range s {
		if i == 0 && r < 32 {
			continue
		}
		if r >= 32 || r == '\n' || r == '\t' || r == '\r' {
			result = append(result, r)
		}
	}
	return strings.TrimSpace(string(result))
}

func truncate(s string, maxLen int) string {
	s = strings.TrimSpace(s)
	s = strings.ReplaceAll(s, "\n", " ")
	runes := []rune(s)
	if len(runes) > maxLen {
		return string(runes[:maxLen]) + "..."
	}
	return s
}

func generateID() string {
	return fmt.Sprintf("%d", os.Getpid())
}
