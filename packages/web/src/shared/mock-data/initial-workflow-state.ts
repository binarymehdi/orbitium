import type { Edge, Node } from "@xyflow/react";

// workflow I: Game Scores Pipeline (matches engine/flow-example.json)
const wf1nodes: Node[] = [
  {
    id: "ns",
    type: "start",
    position: { x: 0, y: 0 },
    data: { label: "Start Pipeline" },
  },
  {
    id: "n1",
    type: "task",
    position: { x: 0, y: 0 },
    data: {
      title: "1. Initialize Game Scores",
      nodeType: "Input",
      description: "Python: Create initial player scores dataset",
      executable: {
        language: "python",
        code: `import json

print("="*50)
print("[PYTHON] Step 1: Initialize Game Scores")
print("="*50)

data = {
    "scores": {
        "mehdi": 20,
        "fadli": 10,
        "sara": 8,
        "ahmed": 12
    },
    "metadata": {
        "game": "Orbitium Challenge",
        "round": 1,
        "created_by": "python"
    }
}

print(f"Players: {list(data['scores'].keys())}")
print(f"Scores: {data['scores']}")
print(f"Total players: {len(data['scores'])}")

with open("/shared/node_n1_output.json", "w") as f:
    json.dump(data, f, indent=2)

print("Data saved -> node_n1_output.json")`,
      },
    },
  },
  {
    id: "n2",
    type: "task",
    position: { x: 0, y: 0 },
    data: {
      title: "2. Predict Next Scores",
      nodeType: "Processing",
      description: "JavaScript: ML-style prediction of next round scores",
      executable: {
        language: "javascript",
        code: `const fs = require('fs');

console.log('='.repeat(50));
console.log('[JAVASCRIPT] Step 2: Predict Next Scores');
console.log('='.repeat(50));

const data = JSON.parse(fs.readFileSync('/shared/node_n1_output.json', 'utf8'));

const predictions = {};
for (const [player, score] of Object.entries(data.scores)) {
    const growth = Math.random() * 0.3 + 0.1;
    predictions[player] = Math.round(score * (1 + growth));
}

data.predictions = predictions;
data.metadata.round = 2;
data.metadata.prediction_model = "simple_growth_js";
data.metadata.processed_by = [...(data.metadata.processed_by || []), "javascript"];

console.log('Original scores:', data.scores);
console.log('Predicted scores:', predictions);

fs.writeFileSync('/shared/node_n2_output.json', JSON.stringify(data, null, 2));
console.log('Data saved -> node_n2_output.json');`,
      },
    },
  },
  {
    id: "n3",
    type: "task",
    position: { x: 0, y: 0 },
    data: {
      title: "3. Calculate Statistics",
      nodeType: "Analysis",
      description: "Go: Compute statistical analysis on scores",
      executable: {
        language: "go",
        code: `package main

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	"sort"
)

type Data struct {
	Scores      map[string]float64 \`json:"scores"\`
	Predictions map[string]float64 \`json:"predictions"\`
	Metadata    map[string]any     \`json:"metadata"\`
	Statistics  map[string]any     \`json:"statistics"\`
}

func main() {
	fmt.Println("==================================================")
	fmt.Println("[GO] Step 3: Calculate Statistics")
	fmt.Println("==================================================")

	file, _ := os.ReadFile("/shared/node_n2_output.json")
	var data Data
	json.Unmarshal(file, &data)

	var values []float64
	for _, v := range data.Scores {
		values = append(values, v)
	}
	sort.Float64s(values)

	sum := 0.0
	for _, v := range values {
		sum += v
	}
	mean := sum / float64(len(values))

	variance := 0.0
	for _, v := range values {
		variance += (v - mean) * (v - mean)
	}
	stddev := math.Sqrt(variance / float64(len(values)))

	data.Statistics = map[string]any{
		"mean":      math.Round(mean*100) / 100,
		"stddev":    math.Round(stddev*100) / 100,
		"min":       values[0],
		"max":       values[len(values)-1],
		"range":     values[len(values)-1] - values[0],
		"computed_by": "go",
	}

	processed := data.Metadata["processed_by"].([]any)
	data.Metadata["processed_by"] = append(processed, "go")

	fmt.Printf("Mean: %.2f\\n", mean)
	fmt.Printf("Std Dev: %.2f\\n", stddev)
	fmt.Printf("Range: %.0f - %.0f\\n", values[0], values[len(values)-1])

	output, _ := json.MarshalIndent(data, "", "  ")
	os.WriteFile("/shared/node_n3_output.json", output, 0644)
	fmt.Println("Data saved -> node_n3_output.json")
}`,
      },
    },
  },
  {
    id: "n4",
    type: "task",
    position: { x: 0, y: 0 },
    data: {
      title: "4. Rank Players",
      nodeType: "Analysis",
      description: "Python: Generate player rankings and insights",
      executable: {
        language: "python",
        code: `import json

print("="*50)
print("[PYTHON] Step 4: Rank Players")
print("="*50)

with open("/shared/node_n3_output.json", "r") as f:
    data = json.load(f)

sorted_players = sorted(data["scores"].items(), key=lambda x: x[1], reverse=True)

rankings = []
for rank, (player, score) in enumerate(sorted_players, 1):
    predicted = data["predictions"].get(player, score)
    improvement = round(((predicted - score) / score) * 100, 1)
    rankings.append({
        "rank": rank,
        "player": player,
        "current_score": score,
        "predicted_score": predicted,
        "expected_improvement": f"{improvement}%"
    })

data["rankings"] = rankings
data["insights"] = {
    "leader": sorted_players[0][0],
    "leader_score": sorted_players[0][1],
    "underdog": sorted_players[-1][0],
    "underdog_score": sorted_players[-1][1],
    "gap": sorted_players[0][1] - sorted_players[-1][1]
}
data["metadata"]["processed_by"].append("python")

print(f"Leader: {data['insights']['leader']} ({data['insights']['leader_score']} pts)")
print(f"Rankings: {[r['player'] for r in rankings]}")

with open("/shared/node_n4_output.json", "w") as f:
    json.dump(data, f, indent=2)

print("Data saved -> node_n4_output.json")`,
      },
    },
  },
  {
    id: "n5",
    type: "task",
    position: { x: 0, y: 0 },
    data: {
      title: "5. Generate Final Report",
      nodeType: "Output",
      description: "JavaScript: Compile final report with all insights",
      executable: {
        language: "javascript",
        code: `const fs = require('fs');

console.log('='.repeat(50));
console.log('[JAVASCRIPT] Step 5: Generate Final Report');
console.log('='.repeat(50));

const data = JSON.parse(fs.readFileSync('/shared/node_n4_output.json', 'utf8'));

const report = {
    title: 'Orbitium Game Analysis Report',
    generated_at: new Date().toISOString(),
    pipeline_languages: data.metadata.processed_by,
    summary: {
        total_players: Object.keys(data.scores).length,
        average_score: data.statistics.mean,
        score_spread: data.statistics.stddev,
        leader: data.insights.leader,
        prediction_model: data.metadata.prediction_model
    },
    leaderboard: data.rankings,
    raw_data: {
        scores: data.scores,
        predictions: data.predictions,
        statistics: data.statistics
    }
};

console.log('');
console.log('FINAL REPORT');
console.log('-'.repeat(40));
console.log(\`Title: \${report.title}\`);
console.log(\`Languages used: \${report.pipeline_languages.join(' -> ')}\`);
console.log(\`Total players: \${report.summary.total_players}\`);
console.log(\`Average score: \${report.summary.average_score}\`);
console.log(\`Leader: \${report.summary.leader}\`);
console.log('');
console.log('LEADERBOARD:');
report.leaderboard.forEach(r => {
    console.log(\`  #\${r.rank} \${r.player}: \${r.current_score} pts (\${r.expected_improvement} predicted growth)\`);
});

fs.writeFileSync('/shared/node_n5_output.json', JSON.stringify(report, null, 2));
console.log('');
console.log('Final report saved -> node_n5_output.json');`,
      },
    },
  },
  {
    id: "ne",
    type: "end",
    position: { x: 0, y: 0 },
    data: { label: "End Pipeline" },
  },
];
const wf1edges: Edge[] = [
  {
    id: "ns-n1",
    source: "ns",
    target: "n1",
    type: "addNodeEdge",
  },
  {
    id: "n1-n2",
    source: "n1",
    target: "n2",
    type: "addNodeEdge",
  },
  {
    id: "n2-n3",
    source: "n2",
    target: "n3",
    type: "addNodeEdge",
  },
  {
    id: "n3-n4",
    source: "n3",
    target: "n4",
    type: "addNodeEdge",
  },
  {
    id: "n4-n5",
    source: "n4",
    target: "n5",
    type: "addNodeEdge",
  },
  {
    id: "n5-ne",
    source: "n5",
    target: "ne",
    type: "addNodeEdge",
  },
];
const workflowI = {
  id: 1,
  name: "Game Scores Pipeline",
  description: "Multi-language pipeline: Python → JavaScript → Go → Python → JavaScript demonstrating data flow across containers",
  initialNodes: wf1nodes,
  initialEdges: wf1edges
}


// workflow II: empty workflow
const wf2nodes: Node[] = [
  {
    id: "ns",
    type: "start",
    position: { x: 0, y: 0 },
    data: { label: "Start Pipeline" },
  },
  {
    id: "n1",
    type: "initial",
    position: { x: 0, y: 0 },
    data: { label: "add your first node" },
  },
  {
    id: "ne",
    type: "end",
    position: { x: 0, y: 0 },
    data: { label: "End Pipeline" },
  },
];
const wf2edges: Edge[] = [
  {
    id: "ns-n1",
    source: "ns",
    target: "n1",
    type: "",
  },
  {
    id: "n1-ne",
    source: "n1",
    target: "ne",
    type: "",
  },

];
const workflowII = { 
  id: 2, 
  name: "Empty Workflow",
  description: "Start from scratch with a blank workflow",
  initialNodes: wf2nodes, 
  initialEdges: wf2edges
}


export const workflows = [workflowI, workflowII]
export const { initialNodes, initialEdges } = workflows[0]