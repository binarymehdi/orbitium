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
    newlyAddedNodeId: string | null
    animatingNodes: Set<string>
    
    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
    addNodeOnEdge: (edgeId: string) => void
    onNodesChange: (changes: any) => void
    onEdgesChange: (changes: any) => void
    onConnect: (connection: any) => void
    relayoutNodes: (newNodes: Node[], newEdges: Edge[]) => void
    initializeFlow: () => void
    clearNewlyAddedNode: () => void
    setAnimatingNode: (nodeId: string, animating: boolean) => void
}

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
)

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    nodes: layoutedNodes,
    edges: layoutedEdges,
    nodeCounter: 7,
    newlyAddedNodeId: null,
    animatingNodes: new Set(),

    setNodes: (nodes) => set({ nodes }),
    
    setEdges: (edges) => set({ edges }),

    clearNewlyAddedNode: () => set({ newlyAddedNodeId: null }),

    setAnimatingNode: (nodeId: string, animating: boolean) => {
        const { animatingNodes } = get()
        const newAnimatingNodes = new Set(animatingNodes)
        if (animating) {
            newAnimatingNodes.add(nodeId)
        } else {
            newAnimatingNodes.delete(nodeId)
        }
        set({ animatingNodes: newAnimatingNodes })
    },

    addNodeOnEdge: (edgeId: string) => {
        const { nodes, edges, nodeCounter } = get()
        const newNodeId = `n${nodeCounter}`
        const newNode = createNewTaskNode(newNodeId)
        
        const targetEdge = edges.find(e => e.id === edgeId)
        if (!targetEdge) return

        const newNodes = [...nodes, newNode]
        
        // Set the newly added node for animation and focus
        set({ 
            nodeCounter: nodeCounter + 1,
            newlyAddedNodeId: newNodeId,
        })
        
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
