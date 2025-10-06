import { useCallback } from 'react'
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
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'

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

    const handleGetWorkflowState = () => {
        const flowState = {
            nodes,
            edges,
            ready: true
        }
        console.log(JSON.stringify(flowState, null, 2))
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div id="flow-description" className="sr-only">
                Interactive workflow diagram with draggable nodes and connectable edges
            </div>
            <div className='absolute top-5 left-5 z-50'>
                <Button onClick={handleGetWorkflowState}>Get Current Workflow State<Download/></Button>
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
