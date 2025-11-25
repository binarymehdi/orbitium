import { useCallback, useEffect } from 'react'
import {
    ReactFlow,
    MiniMap,
    ConnectionLineType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { StartNode } from './components/nodes/start-node'
import TaskNode from './components/nodes/task/task-node'
import { EndNode } from './components/nodes/end-node'
import { AddNodeEdge, getInitialViewPort } from './utils'
import { useWorkflowStore } from '../../shared/store/workflow'
import { useNodesDelete } from './hooks'
import { InitialNode } from './components/nodes/initial-node'
import { useFlow } from '@/shared/integrations/tanstack-query/flows'
import { useParams } from '@tanstack/react-router'
import { PlaygroundNavigation } from './components/navigation'

const nodeTypes = {
    start: StartNode,
    initial: InitialNode,
    task: TaskNode,
    end: EndNode,
};

const edgeTypes = {
    addNodeEdge: AddNodeEdge,
};

const proOptions = { hideAttribution: true };

export default function Playground() {
    const { id } = useParams({ from: '/_layout/flows/$id_/playground' })
    const { data: flow, isLoading } = useFlow(id)
    
    const {
        nodes,
        edges,
        addNodeOnEdge,
        onNodesChange,
        onEdgesChange,
        onConnect,
        loadFlow
    } = useWorkflowStore()
    
    const { onNodesDelete } = useNodesDelete()

    useEffect(() => {
        if (flow?.data?.nodes && flow?.data?.edges) {
            loadFlow(flow.data.nodes, flow.data.edges)
        }
    }, [flow?.data?.nodes, flow?.data?.edges, loadFlow])

    const edgesWithHandlers = edges.map(edge => ({
        ...edge,
        data: { 
            ...edge.data, 
            onAddNode: (id: string) => addNodeOnEdge(id)
        }
    }));

    const handleNodesDelete = useCallback(
        (deleted: any) => onNodesDelete(deleted),
        [onNodesDelete]
    );

    const defaultViewport = getInitialViewPort(nodes);

    

    if (isLoading || nodes.length === 0) {
        return (
            <div style={{ width: '100vw', height: '100vh' }} className="flex items-center justify-center">
                <p>Loading flow...</p>
            </div>
        )
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div id="flow-description" className="sr-only">
                Interactive workflow diagram with draggable nodes and connectable edges
            </div>
            <PlaygroundNavigation flowId={id} />
            <ReactFlow
                nodes={nodes}
                edges={edgesWithHandlers}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodesDelete={handleNodesDelete}
                onConnect={onConnect}
                defaultViewport={defaultViewport}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                defaultEdgeOptions={{ animated: true, type: 'addNodeEdge' }}
                proOptions={proOptions}
                panOnScroll
                snapToGrid
                snapGrid={[10,10]}
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
                aria-describedby="flow-description"
            >
                <MiniMap />
            </ReactFlow>
        </div>
    );
}
