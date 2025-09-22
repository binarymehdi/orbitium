import type { Edge, Node } from "@xyflow/react"

const flowCenterX = 320;
const nodeSpacing = 160;

const nodeWidths = {
    start: 56,
    task: 320,
};

const getCenteredX = (nodeType: string) => {
    const nodeWidth = nodeWidths[nodeType as keyof typeof nodeWidths] || nodeWidths.task;
    return flowCenterX - (nodeWidth / 2);
};

export const initialNodes: Node[] = [
    {
        id: 'n1',
        type: 'start',
        position: { x: getCenteredX('start'), y: 50 },
        data: {
            name: 'Start Pipeline',
            job: 'Entry Point',
            emoji: '🚀',
            logo: 'python'
        },
    },
    {
        id: 'n2',
        type: 'task',
        position: { x: getCenteredX('task'), y: 20 + nodeSpacing },
        data: {
            title: '1. Load Temperature Data',
            nodeType: 'Input',
            description: 'Load CSV file containing temperature sensor readings with timestamps from monitoring stations',
            logo: 'python',
            config: {
                source: 'file',
                path: '/data/temperature_readings.csv'
            }
        },
    },
    {
        id: 'n3',
        type: 'task',
        position: { x: getCenteredX('task'), y: 50 + nodeSpacing * 2 },
        data: {
            title: '2. Clean & Validate Data',
            nodeType: 'Processing',
            description: 'Remove invalid readings (null values, outliers) and filter temperatures outside valid range (-50°C to 50°C)',
            logo: 'python',
            container: 'python:3.9',
            code: 'future-work'
        },
    },
    {
        id: 'n4',
        type: 'task',
        position: { x: getCenteredX('task'), y: 70 + nodeSpacing * 3 },
        data: {
            title: '3. Calculate Statistics',
            nodeType: 'Analysis',
            description: 'Compute mean, standard deviation, min/max values, and detect anomalies (readings >2 std from mean)',
            logo: 'python',
            container: 'python:3.9-scipy',
            code: 'future-work'
        },
    },
    {
        id: 'n5',
        type: 'task',
        position: { x: getCenteredX('task'), y: 90 + nodeSpacing * 4 },
        data: {
            title: '4. Generate Visualization',
            nodeType: 'Output',
            description: 'Create time series plot and histogram showing temperature distribution with statistical overlays',
            logo: 'react',
            container: 'react',
            code: 'future-work'
        },
    },
    {
        id: 'n6',
        type: 'end',
        position: { x: getCenteredX('start'), y: 0 + nodeSpacing * 6 },
        data: {
            name: 'Start Pipeline',
            job: 'Entry Point',
            emoji: '🚀',
            logo: 'python'
        },
    },
]

export const initialEdges: Edge[] = [
    {
        id: 'n1-n2',
        source: 'n1',
        target: 'n2',
        type: 'smoothstep',
    },
    {
        id: 'n2-n3',
        source: 'n2',
        target: 'n3',
        type: 'smoothstep',
    },
    {
        id: 'n3-n4',
        source: 'n3',
        target: 'n4',
        type: 'smoothstep',
    },
    {
        id: 'n4-n5',
        source: 'n4',
        target: 'n5',
        type: 'smoothstep',
    },
    {
        id: 'n5-n6',
        source: 'n5',
        target: 'n6',
        type: 'smoothstep',
    },
]