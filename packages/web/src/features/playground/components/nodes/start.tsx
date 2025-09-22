import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';




export const StartNode = memo(function StartNode() {
    return (
        <div className='px-2 py-1 rounded-full bg-sky-900 border-1 border-sky-700 w-20 '>
            <div className='flex flex-row items-center justify-center px-1 gap-1'>
                <Play className='h-3 w-3 text-white'/>
                <h1 className='text-white text-sm'>Start</h1>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-16 !bg-teal-500"
            />
        </div>
    )
});
