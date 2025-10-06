import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';




export const InitialNode = memo(function InitialNode() {
    return (
        <div className="relative h-30 w-52 rounded-2xl border-2 border-dashed bg-transparent backdrop-blur-xs ">
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                <GridPattern />
            </div>
            <div className='relative space-y-2 z-10 w-full h-full flex flex-col items-center justify-center group cursor-pointer'>
                <img 
                    src="/plus-svgrepo-com.svg" 
                    alt="Add node" 
                    className="z-20 w-12 h-12 nopan nodrag transition-all duration-300 ease-in-out group-hover:scale-140 pointer-events-none" 
                />
            </div>
            <Handle
                type="target"
                position={Position.Top}
                className="w-16 !border-2 !border-white/70 !bg-gradient-to-r !from-teal-400 !to-blue-500 !shadow-sm"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-16 !border-2 !border-white/70 !bg-gradient-to-r !from-teal-400 !to-blue-500 !shadow-sm"
            />
        </div>
    )
});




export function GridPattern() {
    const columns = 10;
    const rows = 5;
    return (
        <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
            {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: columns }).map((_, col) => {
                    const index = row * columns + col;
                    return (
                        <div
                            key={`${col}-${row}`}
                            className={`w-8 h-8 flex shrink-0 rounded-[5px] ${index % 2 === 0
                                ? "bg-gray-50 dark:bg-neutral-950"
                                : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                                }`}
                        />
                    );
                })
            )}
        </div>
    );
}