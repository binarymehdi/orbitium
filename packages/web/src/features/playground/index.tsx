import { useCallback } from 'react'
import {
    ReactFlow,
    MiniMap,
    ConnectionLineType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { StartNode } from './components/nodes/start'
import TaskNode from './components/nodes/task'
import { EndNode } from './components/nodes/end'
import { AddNodeEdge, getInitialViewPort } from './utils'
import { useWorkflowStore } from '../../shared/store/workflow'
import { useNodesDelete } from './hooks'

const nodeTypes = {
    start: StartNode,
    task: TaskNode,
    end: EndNode,
};

const edgeTypes = {
    addNodeEdge: AddNodeEdge,
};

const proOptions = { hideAttribution: true };

export default function Playground() {
    const {
        nodes,
        edges,
        addNodeOnEdge,
        onNodesChange,
        onEdgesChange,
        onConnect
    } = useWorkflowStore()
    
    const { onNodesDelete } = useNodesDelete()

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

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div id="flow-description" className="sr-only">
                Interactive workflow diagram with draggable nodes and connectable edges
            </div>
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
                snapGrid={[25,25]}
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
