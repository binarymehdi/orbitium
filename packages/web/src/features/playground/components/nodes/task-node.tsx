import { Handle, Position } from "@xyflow/react";
import { memo } from "react";
import NodeSpecsDrawer from "./task/settings-drawer";

type Executable = {
  language: string;
  code: string;
};

type NodeData = {
  title: string;
  nodeType: string;
  description: string;
  executable: Executable;
};

const TaskNode = ({ data, id }: { data: NodeData; id: string }) => {
  return (
    <div className="relative h-40 w-86 rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/70 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-md">
      <div className="absolute top-2 right-2">
        <NodeSpecsDrawer nodeId={id} />
      </div>
      <NodeContent data={data} />
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
  );
};

const NodeContent = ({ data }: { data: NodeData }) => {
  return (
    <div className="flex h-full flex-col space-y-3">
      <div className="flex items-start space-x-3 pr-8">
        <div className="h-12 w-12 flex-shrink-0 rounded-xl border border-gray-200/70 bg-gradient-to-br from-gray-50 to-gray-100 p-2.5">
          <img
            src={`/stack-logos/${data.executable.language}.svg`}
            alt={data.executable.language}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-md leading-tight font-semibold text-gray-800">
            {data.title}
          </h1>
          <span className="mt-1 inline-block rounded-full border border-blue-200/50 bg-blue-100/70 px-2 py-0.5 text-xs font-medium text-gray-800">
            {data.nodeType}
          </span>
        </div>
      </div>
      <div className="h-px w-full bg-gray-200"></div>
      <div className="line-clamp-3 flex-1 text-xs leading-relaxed text-gray-600">
        {data.description}
      </div>
    </div>
  );
};

export default memo(TaskNode);
