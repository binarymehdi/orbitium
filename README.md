# Orbitium
A scientific workflow software orchestrator for ease of use and collaboration. Made for scientists to focus on what matters.

Initial Milestone
we are building a consecutive containarized nodes (no conditional statements for now, just one after the other)

we are executing simple consecutive steps, each step is containarized node execuring a simple codeblock for now.


# Engine

## Running the Pipeline Execution Engine

The pipeline engine takes React Flow graph representations and executes them as containerized workflows using Docker.

### Prerequisites
- Go 1.25+
- Docker running locally

### Quick Start

```bash
cd packages/engine

go mod tidy

go run cmd/engine/main.go flow-example.json
```

### Configuration

Edit `packages/engine/config.yaml` to add language support:

```yaml
languages:
  python: python:3.11-slim
  go: golang:1.21-alpine
  javascript: node:20-alpine
  typescript: node:20-alpine
  ruby: ruby:3.2-alpine
  rust: rust:1.74-alpine
```

### Pipeline Format

Create a pipeline JSON file with React Flow format:

```json
{
  "nodes": [
    {
      "id": "ns",
      "type": "start",
      "data": { "label": "Start" }
    },
    {
      "id": "n1",
      "type": "task",
      "data": {
        "title": "My Task",
        "executable": {
          "language": "python",
          "code": "import json\nprint('Hello')\nwith open('/shared/node_n1_output.json', 'w') as f:\n    json.dump({'result': 42}, f)"
        }
      }
    },
    {
      "id": "ne",
      "type": "end",
      "data": { "label": "End" }
    }
  ],
  "edges": [
    { "source": "ns", "target": "n1" },
    { "source": "n1", "target": "ne" }
  ]
}
```

### How It Works

1. **Loads config** - Maps languages to Docker images
2. **Parses pipeline** - Reads React Flow JSON and builds execution order
3. **Creates shared volume** - For data passing between nodes
4. **Executes nodes** - Runs each task in order, reusing containers per language
5. **Cleans up** - Removes containers and volume
