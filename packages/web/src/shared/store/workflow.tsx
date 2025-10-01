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

interface WorkflowState {
    nodes: Node[]
    edges: Edge[]
    nodeCounter: number
    
    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
    getNodeById: (id: string) => Node | undefined
    updateNodeMetaData: (nodeId: string, nodeMetaData: NodeMetaData) => void
    updateNodeCode: (nodeId: string, newCode: string) => void
    addNodeOnEdge: (edgeId: string) => void
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
    language: string,
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
                        executable: {
                            ...(node.data as any).executable,
                            language: nodeMetaData.language
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

    addNodeOnEdge: (edgeId: string) => {
        const { nodes, edges, nodeCounter } = get()
        const newNodeId = `n${nodeCounter}`
        const newNode = createNewTaskNode(newNodeId)
        
        const targetEdge = edges.find(e => e.id === edgeId)
        if (!targetEdge) return

        const newNodes = [...nodes, newNode]
        
        const newEdges = edges.map(edge => {
            if (edge.id === edgeId) {
                return null
            }
            return {
                ...edge,
                type: 'addNodeEdge',
                data: { 
                    ...edge.data, 
                    onAddNode: (id: string) => get().addNodeOnEdge(id)
                }
            }
        }).filter(Boolean) as Edge[]

        newEdges.push(
            {
                id: `${targetEdge.source}-${newNodeId}`,
                source: targetEdge.source,
                target: newNodeId,
                type: 'addNodeEdge',
                data: { 
                    onAddNode: (id: string) => get().addNodeOnEdge(id)
                }
            },
            {
                id: `${newNodeId}-${targetEdge.target}`,
                source: newNodeId,
                target: targetEdge.target,
                type: 'addNodeEdge',
                data: { 
                    onAddNode: (id: string) => get().addNodeOnEdge(id)
                }
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
            data: { 
                onAddNode: (id: string) => get().addNodeOnEdge(id)
            }
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
