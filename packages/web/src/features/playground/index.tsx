import { useCallback } from 'react'
import {
    ReactFlow,
    addEdge,
    type Connection,
    useNodesState,
    useEdgesState,
    MiniMap,
    type Viewport,
    getIncomers,
    getOutgoers,
    getConnectedEdges,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { StartNode } from './components/nodes/start'
import TaskNode from './components/nodes/task';

import { initialEdges, initialNodes } from './flow-config'
import { EndNode } from './components/nodes/end';

const nodeTypes = {
    start: StartNode,
    task: TaskNode,
    end: EndNode,
};



const proOptions = { hideAttribution: true };

const startNode = initialNodes.find(node => node.type === 'start');
const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
const zoom = 1.4;

const defaultViewport: Viewport = {
    x: viewportWidth / 2 - (startNode?.position.x || 0) * zoom,
    y: viewportHeight / 8 - (startNode?.position.y || 0) * zoom,
    zoom,
};

export default function PlaygroundExample() {
    const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    const onConnect = useCallback(
        (params: Connection) => setEdges((edges) => addEdge(params, edges)),
        []
    )

    const onNodesDelete = useCallback(
        (deleted: any) => {
            let remainingNodes = [...nodes];
            setEdges(
                deleted.reduce((acc: any, node: any) => {
                    const incomers = getIncomers(node, remainingNodes, acc);
                    const outgoers = getOutgoers(node, remainingNodes, acc);
                    const connectedEdges = getConnectedEdges([node], acc);

                    const remainingEdges = acc.filter((edge: any) => !connectedEdges.includes(edge));

                    const createdEdges = incomers.flatMap(({ id: source }) =>
                        outgoers.map(({ id: target }) => ({
                            id: `${source}->${target}`,
                            source,
                            target,
                        })),
                    );

                    remainingNodes = remainingNodes.filter((rn) => rn.id !== node.id);

                    return [...remainingEdges, ...createdEdges];
                }, edges),
            );
        },
        [nodes, edges],
    );

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodesDelete={onNodesDelete}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                connectionLineStyle={{ stroke: '#ffff' }}
                defaultEdgeOptions={{ animated: true, type: 'smoothstep' }}
                defaultViewport={defaultViewport}
                proOptions={proOptions}
                panOnScroll
            >
                <MiniMap />
            </ReactFlow>
        </div>
    )
}