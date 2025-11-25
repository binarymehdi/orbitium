import type { Edge, Node } from "@xyflow/react";

export interface FlowData {
  nodes: Node[];
  edges: Edge[];
  ready?: boolean;
}

export interface FlowBase {
  name: string;
  description: string;
  data: FlowData | null;
}

export interface FlowRead extends FlowBase {
  id: string;
}

export interface FlowUpdate {
  name?: string;
  description?: string;
  data?: FlowData | null;
}
