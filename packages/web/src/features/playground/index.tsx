import { useCallback, useEffect, useRef } from 'react'
import {
    ReactFlow,
    MiniMap,
    ConnectionLineType,
    useReactFlow,
    ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { StartNode } from './components/nodes/start'
import TaskNode from './components/nodes/task'
import { EndNode } from './components/nodes/end'
import { AddNodeEdge, getInitialViewPort, getFocusViewPort, animateNodeIn } from './utils'
import { useWorkflowStore } from './workflow-store'
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

function FlowContent() {
    const {
        nodes,
        edges,
        addNodeOnEdge,
        onNodesChange,
        onEdgesChange,
        onConnect,
        newlyAddedNodeId,
        clearNewlyAddedNode
    } = useWorkflowStore()
    
    const { onNodesDelete } = useNodesDelete()
    const { setCenter } = useReactFlow()

    // Focus on newly added node with animation
    useEffect(() => {
        if (newlyAddedNodeId) {
            const newNode = nodes.find(node => node.id === newlyAddedNodeId);
            if (newNode) {
                // Animate viewport to focus on new node
                setTimeout(() => {
                    setCenter(newNode.position.x, newNode.position.y, { 
                        zoom: 1.2, 
                        duration: 600 
                    });
                }, 100);
                
                // Animate the new node appearance
                setTimeout(() => {
                    const nodeElement = document.querySelector(`[data-id="${newlyAddedNodeId}"]`) as HTMLElement;
                    if (nodeElement) {
                        animateNodeIn(nodeElement);
                    }
                }, 400);
                
                // Clear the newly added node reference after animation
                setTimeout(() => {
                    clearNewlyAddedNode();
                }, 1200);
            }
        }
    }, [newlyAddedNodeId, nodes, setCenter, clearNewlyAddedNode]);

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
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
        >
            <MiniMap />
        </ReactFlow>
    );
}

export default function Playground() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlowProvider>
                <FlowContent />
            </ReactFlowProvider>
        </div>
    );
}
