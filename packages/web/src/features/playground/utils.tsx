import {
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
    type EdgeProps,
    type Node,
} from '@xyflow/react'
import dagre from '@dagrejs/dagre'

export function AddNodeEdge({ 
    id, 
    sourceX, 
    sourceY, 
    targetX, 
    targetY, 
    sourcePosition, 
    targetPosition,
    data 
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onAddNode = () => {
        if (data?.onAddNode && typeof data.onAddNode === 'function') {
            data.onAddNode(id);
        }
    };

    return (
        <>
            <BaseEdge path={edgePath} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    <button
                        className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-colors"
                        onClick={onAddNode}
                        title="Add node here"
                    >
                        +
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

const getNodeDimensions = (nodeType: string) => {
    switch (nodeType) {
        case 'start':
        case 'end':
            return { width: 80, height: 40 };
        case 'task':
        default:
            return { width: 344, height: 160 };
    }
};

export const getLayoutedElements = (nodes: any[], edges: any[]) => {
    const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    graph.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 80 });

    nodes.forEach((node) => {
        const { width, height } = getNodeDimensions(node.type);
        graph.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
        graph.setEdge(edge.source, edge.target);
    });

    dagre.layout(graph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = graph.node(node.id);
        const { width, height } = getNodeDimensions(node.type);

        const newNode = {
            ...node,
            targetPosition: 'top',
            sourcePosition: 'bottom',
            position: {
                x: nodeWithPosition.x - width / 2,
                y: nodeWithPosition.y - height / 2,
            },
        };

        return newNode;
    });

    return { nodes: newNodes, edges };
};

export const createNewTaskNode = (id: string): Node => ({
    id,
    type: 'task',
    position: { x: 0, y: 0 },
    data: {
        title: `New Task ${id}`,
        nodeType: 'Processing',
        description: 'A new processing step in the pipeline',
        logo: 'python',
        container: 'python:3.9',
        code: 'future-work'
    },
});

export const getInitialViewPort = (nodes: Node[]) => {
    const startNode = nodes.find(node => node.type === 'start');
    const defaultViewport = startNode ? {
        x: -startNode.position.x + window.innerWidth / 2,
        y: -startNode.position.y + window.innerHeight / 8,
        zoom: 1.2
    } : { x: 0, y: 0, zoom: 1.0 };
    return defaultViewport;
}

export const getInitialNodeCounter = (initialNodes: Node[]): number => {
    const nodeNumbers = initialNodes
        .map((node: Node) => node.id)
        .filter((id: string) => id.match(/^n\d+$/))
        .map((id: string) => parseInt(id.slice(1)))
        .filter((num: number) => !isNaN(num))
    
    return nodeNumbers.length > 0 ? Math.max(...nodeNumbers) + 1 : 1
}