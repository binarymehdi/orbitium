import { Workflow, Trash2 } from "lucide-react";
import type { FlowRead } from "@/shared/types/flow";

interface FlowCardProps {
  flow: FlowRead;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const FlowCard = ({ flow, onClick, onDelete }: FlowCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group bg-white relative overflow-hidden rounded-2xl border-2 border-gray-200 p-6 transition-all hover:border-sky-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-900 focus:ring-offset-2 text-left"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-gradient-to-br from-blue-50 to-blue-100 p-3">
              <Workflow className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 ">
              {flow.name}
            </h3>
          </div>
          
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete flow"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>

        <div>
          
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {flow.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
          <span>{flow.data?.nodes?.length || 0} nodes</span>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/0 to-blue-50/0 transition-all group-hover:from-blue-50/50 group-hover:to-blue-100/30" />
    </button>
  );
};
