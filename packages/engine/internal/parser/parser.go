package parser

import (
	"encoding/json"
	"errors"
	"os"

	"pipeline-engine/internal/types"
)

func LoadPipeline(path string) (types.Pipeline, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return types.Pipeline{}, err
	}

	var pipeline types.Pipeline
	if err := json.Unmarshal(data, &pipeline); err != nil {
		return types.Pipeline{}, err
	}

	return pipeline, nil
}

func BuildExecutionOrder(pipeline types.Pipeline) ([]types.Node, error) {
	nextNode := make(map[string]string)
	for _, edge := range pipeline.Edges {
		nextNode[edge.Source] = edge.Target
	}

	nodeByID := make(map[string]types.Node)
	var startNodeID string

	for _, node := range pipeline.Nodes {
		nodeByID[node.ID] = node
		if node.Type == "start" {
			startNodeID = node.ID
		}
	}

	if startNodeID == "" {
		return nil, errors.New("no start node found in pipeline")
	}

	var order []types.Node
	currentID := startNodeID
	visited := make(map[string]bool)

	for currentID != "" {
		if visited[currentID] {
			return nil, errors.New("cycle detected in pipeline")
		}
		visited[currentID] = true

		node := nodeByID[currentID]
		if node.Type == "task" {
			order = append(order, node)
		}

		currentID = nextNode[currentID]
	}

	return order, nil
}
