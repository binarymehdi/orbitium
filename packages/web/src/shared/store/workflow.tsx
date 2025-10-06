import { create } from 'zustand'
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Node,
    type Edge,
} from '@xyflow/react'
import { createNewTaskNode, getInitialNodeCounter, getLayoutedElements } from '../../features/playground/utils'
import { initialNodes, initialEdges } from '../mock-data/initial-workflow-state'
import { getNewCodeLanguageTemplate } from '@/features/code-editor/utils'

interface WorkflowState {
    nodes: Node[]
    edges: Edge[]
    nodeCounter: number

    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
    getNodeById: (id: string) => Node | undefined
    updateNodeMetaData: (nodeId: string, nodeMetaData: NodeMetaData) => void
    setNodeBaseLanguage: (nodeId: string, newNodeLanguage: string) => void
    updateNodeCode: (nodeId: string, newCode: string) => void
    addNodeOnEdge: (edgeId: string, data?: any) => void
    onNodesChange: (changes: any) => void
    onEdgesChange: (changes: any) => void
    onConnect: (connection: any) => void
    relayoutNodes: (newNodes: Node[], newEdges: Edge[]) => void
    initializeFlow: () => void
}

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
)

type NodeMetaData = {
    title: string,
    description: string,
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    nodes: layoutedNodes,
    edges: layoutedEdges,
    nodeCounter: getInitialNodeCounter(initialNodes),

    setNodes: (nodes) => set({ nodes }),

    setEdges: (edges) => set({ edges }),

    getNodeById: (nodeId: string) => {
        const { nodes } = get()
        return nodes.find(node => node.id === nodeId)
    },

    updateNodeMetaData: (nodeId: string, nodeMetaData: NodeMetaData) => {
        const { nodes } = get()
        const updatedNodes = nodes.map(node => {
            if (node.id === nodeId) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        title: nodeMetaData.title,
                        description: nodeMetaData.description,
                    }
                }
            }
            return node
        })
        set({ nodes: updatedNodes })
    },

    setNodeBaseLanguage: (nodeId: string, newNodeLanguage: string) => {
        const { nodes } = get();
        const newCode = getNewCodeLanguageTemplate(newNodeLanguage)
        const updatedNodes = nodes.map(node => {
            if (node.id === nodeId) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        executable: {
                            language: newNodeLanguage,
                            code: newCode
                        }
                    }
                }
            }
            return node
        })
        set({ nodes: updatedNodes })
    },

    updateNodeCode: (nodeId: string, newCode: string) => {
        const { nodes } = get();
        const updatedNodes = nodes.map(node => {
            if (node.id === nodeId) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        executable: {
                            ...(node.data as any).executable,
                            code: newCode
                        }
                    }
                }
            }
            return node
        })
        set({ nodes: updatedNodes })
    },

    addNodeOnEdge: (edgeId: string, data: { title: string; description: string; language: string }) => {
        const { title, description, language } = data;
        const { nodes, edges, nodeCounter } = get()
        const newNodeId = `n${nodeCounter}`
        const newCode = getNewCodeLanguageTemplate(language) || ""

        const newNodeData = {
            id: newNodeId,
            title,
            description,
            executable: {
                language,
                code: newCode
            }
        }
        const newNode = createNewTaskNode(newNodeData)

        const targetEdge = edges.find(e => e.id === edgeId)
        if (!targetEdge) return

        const newNodes = [...nodes, newNode]

        const newEdges = edges
            .filter(edge => edge.id !== edgeId)
            .map(edge => ({
                ...edge,
                type: 'addNodeEdge',
            }))

        newEdges.push(
            {
                id: `${targetEdge.source}-${newNodeId}`,
                source: targetEdge.source,
                target: newNodeId,
                type: 'addNodeEdge',
            },
            {
                id: `${newNodeId}-${targetEdge.target}`,
                source: newNodeId,
                target: targetEdge.target,
                type: 'addNodeEdge',
            }
        )

        set({ nodeCounter: nodeCounter + 1 })
        get().relayoutNodes(newNodes, newEdges)
    },

    relayoutNodes: (newNodes: Node[], newEdges: Edge[]) => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges)
        set({
            nodes: layoutedNodes,
            edges: layoutedEdges
        })
    },

    onNodesChange: (changes) => {
        const { nodes } = get()
        const updatedNodes = applyNodeChanges(changes, nodes)
        set({ nodes: updatedNodes })
    },

    onEdgesChange: (changes) => {
        const { edges } = get()
        const updatedEdges = applyEdgeChanges(changes, edges)
        set({ edges: updatedEdges })
    },

    onConnect: (connection) => {
        const { edges } = get()
        const newEdge = {
            ...connection,
            type: 'addNodeEdge',
            animated: true,
        }
        const updatedEdges = addEdge(newEdge, edges)
        set({ edges: updatedEdges })
    },

    initializeFlow: () => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            initialNodes,
            initialEdges,
        )
        set({
            nodes: layoutedNodes,
            edges: layoutedEdges,
            nodeCounter: getInitialNodeCounter(initialNodes)
        })
    }
}))
