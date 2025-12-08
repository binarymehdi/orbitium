package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"pipeline-engine/internal/config"
	"pipeline-engine/internal/executor"
	"pipeline-engine/internal/parser"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: go run main.go <pipeline.json>")
	}

	pipelineFile := os.Args[1]
	ctx := context.Background()

	fmt.Println("Loading config...")
	cfg, err := config.Load("config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	fmt.Println("Parsing pipeline...")
	pipeline, err := parser.LoadPipeline(pipelineFile)
	if err != nil {
		log.Fatalf("Failed to load pipeline: %v", err)
	}

	nodes, err := parser.BuildExecutionOrder(pipeline)
	if err != nil {
		log.Fatalf("Failed to build execution order: %v", err)
	}

	fmt.Printf("Found %d nodes to execute\n", len(nodes))

	exec, err := executor.New(cfg)
	if err != nil {
		log.Fatalf("Failed to create executor: %v", err)
	}
	defer func() {
		fmt.Println("Cleaning up containers...")
		exec.Cleanup(ctx)
	}()

	fmt.Println("Creating shared volume...")
	if err := exec.Setup(ctx); err != nil {
		log.Fatalf("Failed to setup executor: %v", err)
	}

	if err := exec.Run(ctx, nodes); err != nil {
		log.Fatalf("Pipeline failed: %v", err)
	}

	fmt.Println("\n🎉 Pipeline completed successfully!")
}
