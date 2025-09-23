import { Handle, Position } from "@xyflow/react";
import { memo } from "react";
import NodeSpecsDrawer from "./node-specs-drawer";

type NodeData = {
    logo: string,
    title: string,
    nodeType: string, // either python script, golang script, http server, cron job agent 
    description: string,
}


const TaskNode = ({ data }: { data: NodeData }) => {
    return (
        <div className="relative px-4 py-3 rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/90 via-white/80 to-gray-50/70 border border-gray-200/50 shadow-lg shadow-black/5 w-86 h-40">
            <div className="absolute top-2 right-2"><NodeSpecsDrawer /></div>
            
            <div className="flex flex-col h-full space-y-3">
                <div className="flex items-start space-x-3 pr-8">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/70 p-2.5 flex-shrink-0">
                        <img src={`/stack-logos/${data.logo}.svg`} alt={data.logo} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-md font-semibold text-gray-800 leading-tight">{data.title}</h1>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-gray-800 bg-blue-100/70 rounded-full border border-blue-200/50">
                            {data.nodeType}
                        </span>
                    </div>
                </div>
                
                <div className="w-full h-px bg-gray-200"></div>
                
                <div className="text-xs text-gray-600 leading-relaxed line-clamp-3 flex-1">
                    {data.description}
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Top}
                className="w-16 !bg-gradient-to-r !from-teal-400 !to-blue-500 !border-2 !border-white/70 !shadow-sm"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-16 !bg-gradient-to-r !from-teal-400 !to-blue-500 !border-2 !border-white/70 !shadow-sm"
            />
        </div>
    );
}

export default memo(TaskNode);