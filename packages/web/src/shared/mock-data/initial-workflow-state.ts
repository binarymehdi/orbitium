import type { Edge, Node } from "@xyflow/react";

// workflow I: flow with data
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
      title: "1. Load Temperature Data",
      nodeType: "Input",
      description:
        "Load CSV file containing temperature sensor readings with timestamps from monitoring stations",
      executable: {
        language: "python",
        code: "future-work",
      },
    },
  },
  {
    id: "n2",
    type: "task",
    position: { x: 0, y: 0 },
    data: {
      title: "2. Clean & Validate Data",
      nodeType: "Processing",
      description:
        "Remove invalid readings (null values, outliers) and filter temperatures outside valid range (-50°C to 50°C)",
      executable: {
        language: "python",
        code: "future-work",
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
      description:
        "Compute mean, standard deviation, min/max values, and detect anomalies (readings >2 std from mean)",
      executable: {
        language: "go",
        code: "future-work",
      },
    },
  },
  {
    id: "n4",
    type: "task",
    position: { x: 0, y: 0 },
    data: {
      title: "4. Generate Visualization",
      nodeType: "Output",
      description:
        "Create time series plot and histogram showing temperature distribution with statistical overlays",
      executable: {
        language: "javascript",
        code: "future-work",
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
    id: "n4-ne",
    source: "n4",
    target: "ne",
    type: "addNodeEdge",
  },
];
const workflowI = {
  id: 1,
  name: "Workflow Example I",
  description: "Illustrating example usecase for Orbitium, the workflow management system",
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