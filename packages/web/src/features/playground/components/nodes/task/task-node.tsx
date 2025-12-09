import { Handle, Position } from "@xyflow/react";
import { memo } from "react";
import NodeSpecsDrawer from "./settings-drawer";
import { useWorkflowStore, type NodeExecutionStatus } from "@/shared/store/workflow";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

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

const getExecutionStyles = (status: NodeExecutionStatus) => {
  switch (status) {
    case 'running':
      return 'border-2 border-amber-400 shadow-xl shadow-amber-200/60 scale-105';
    case 'completed':
      return 'border-2 border-emerald-500 shadow-xl shadow-emerald-200/60';
    case 'error':
      return 'border-2 border-rose-500 shadow-xl shadow-rose-200/60';
    default:
      return 'border border-gray-300/50';
  }
};

const getStatusIndicator = (status: NodeExecutionStatus) => {
  switch (status) {
    case 'running':
      return (
        <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 shadow-lg animate-pulse">
          <Loader2 className="h-5 w-5 text-white animate-spin" />
        </div>
      );
    case 'completed':
      return (
        <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 shadow-lg animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
      );
    case 'error':
      return (
        <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 shadow-lg animate-in zoom-in-50 duration-300">
          <XCircle className="h-5 w-5 text-white" />
        </div>
      );
    default:
      return null;
  }
};

const TaskNode = ({ data, id }: { data: NodeData; id: string }) => {
  const executionState = useWorkflowStore((state) => state.executionState);
  const status = executionState[id] || 'idle';
  
  return (
    <div className={`relative h-40 w-86 rounded-2xl bg-gradient-to-br from-white/95 via-white/90 to-gray-50/80 px-4 py-3 backdrop-blur-md transition-all duration-500 ease-out ${getExecutionStyles(status)}`}>
      {getStatusIndicator(status)}
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
        <div className="h-12 w-12 rounded-xl border border-gray-200/70 bg-gradient-to-br from-gray-50 to-gray-100 p-1">
          <img
            src={`/stack-logos/${data.executable.language}.svg`}
            alt={data.executable.language}
            className="h-full w-full rounded-md object-contain"
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
