import type { Edge, Node } from "@xyflow/react";

const position = { x: 0, y: 0 };

export const initialNodes: Node[] = [
  {
    id: "n1",
    type: "start",
    position: position,
    data: { label: "Start Pipeline" },
  },
  {
    id: "n2",
    type: "task",
    position: position,
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
    id: "n3",
    type: "task",
    position: position,
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
    id: "n4",
    type: "task",
    position: position,
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
    id: "n5",
    type: "task",
    position: position,
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
    id: "n6",
    type: "end",
    position: position,
    data: { label: "End Pipeline" },
  },
];

export const initialEdges: Edge[] = [
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
    id: "n5-n6",
    source: "n5",
    target: "n6",
    type: "addNodeEdge",
  },
];
