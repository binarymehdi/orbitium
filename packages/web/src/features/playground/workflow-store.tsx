import { create } from 'zustand'
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Node,
    type Edge,
} from '@xyflow/react'
import { createNewTaskNode, getLayoutedElements } from './utils'
import { initialNodes, initialEdges } from './initial-data'

interface WorkflowState {
    nodes: Node[]
    edges: Edge[]
    nodeCounter: number
    
    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
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

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    nodes: layoutedNodes,
    edges: layoutedEdges,
    nodeCounter: 7,

    setNodes: (nodes) => set({ nodes }),
    
    setEdges: (edges) => set({ edges }),

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
            nodeCounter: 7 
        })
    }
}))
