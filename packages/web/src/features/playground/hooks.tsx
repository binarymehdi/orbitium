import { useCallback } from 'react'
import {
    getIncomers,
    getOutgoers,
    getConnectedEdges,
    type Node,
    type Edge,
} from '@xyflow/react'
import { useWorkflowStore } from '../../shared/store/workflow'


export function useNodesDelete() {
    const { nodes, edges, relayoutNodes, addNodeOnEdge } = useWorkflowStore()

    const onNodesDelete = useCallback((deleted: Node[]) => {
        let remainingNodes = [...nodes]
        
        const newEdges = deleted.reduce((acc: Edge[], node: Node) => {
            const incomers = getIncomers(node, remainingNodes, acc)
            const outgoers = getOutgoers(node, remainingNodes, acc)
            const connectedEdges = getConnectedEdges([node], acc)

            const remainingEdges = acc.filter((edge: Edge) => !connectedEdges.includes(edge))

            const createdEdges = incomers.flatMap(({ id: source }) =>
                outgoers.map(({ id: target }) => ({
                    id: `${source}->${target}`,
                    source,
                    target,
                    type: 'addNodeEdge',
                    data: { 
                        onAddNode: (id: string) => addNodeOnEdge(id)
                    }
                })),
            )

            remainingNodes = remainingNodes.filter((rn) => rn.id !== node.id)

            return [...remainingEdges, ...createdEdges]
        }, edges)

        relayoutNodes(remainingNodes, newEdges)
    }, [nodes, edges, relayoutNodes, addNodeOnEdge])

    return { onNodesDelete }
}