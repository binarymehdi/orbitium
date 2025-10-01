import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';




export const EndNode = memo(function EndNode() {
    return (
        <div className='px-2 py-1 rounded-full bg-orange-500 border-1 border-sky-700 w-20 '>
            <div className='flex flex-row items-center justify-center px-1 gap-1'>
                <h1 className='text-white text-sm'>End</h1>
            </div>
            <Handle
                type="target"
                position={Position.Top}
                className="w-16 !bg-teal-500"
            />
        </div>
    )
});
