# Pipeline Execution Engine

A minimal pipeline execution engine that takes React Flow graph representations and executes them as containerized workflows using Docker.

## Project Structure

```
engine/
├── cmd/
│   └── engine/
│       └── main.go           # Application entrypoint
├── internal/
│   ├── config/
│   │   └── config.go         # Configuration loading
│   ├── executor/
│   │   └── executor.go       # Docker execution logic
│   ├── parser/
│   │   └── parser.go         # Pipeline JSON parsing
│   └── types/
│       └── types.go          # Shared type definitions
├── config.yaml               # Language to Docker image mapping
├── flow-example.json         # Example pipeline
├── go.mod
└── README.md
```

## Prerequisites

- Go 1.25+
- Docker running locally

## Quick Start

```bash
cd packages/engine

go mod tidy

go run cmd/engine/main.go flow-example.json
```

## Configuration

Edit `config.yaml` to add language support:

```yaml
languages:
  python: python:3.11-slim
  go: golang:1.21-alpine
  javascript: node:20-alpine
```

## Input Format

React Flow JSON with nodes and edges:

```json
{
  "nodes": [
    {
      "id": "n1",
      "type": "task",
      "data": {
        "title": "My Task",
        "executable": {
          "language": "python",
          "code": "print('Hello')"
        }
      }
    }
  ],
  "edges": [
    {"source": "ns", "target": "n1"}
  ]
}
```

## Node Types

- `start` - Pipeline entry point
- `task` - Executable node with code
- `end` - Pipeline exit point

## Data Flow

Nodes communicate via shared volume:
- Write: `/shared/node_{id}_output.json`
- Read: `/shared/node_{previous_id}_output.json`
