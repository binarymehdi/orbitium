import { useFlows, useDeleteFlow } from "@/shared/integrations/tanstack-query/flows";
import { useFlowsNavigation } from "../hooks/use-flows-navigation";
import { FlowCard } from "./flow-card";
import { Workflow } from "lucide-react";

const FlowsList = () => {
  const { data: flows, isLoading } = useFlows();
  const { navigateToPlayground } = useFlowsNavigation();
  const deleteFlow = useDeleteFlow();

  const handleDelete = (flowId: string, flowName: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${flowName}"? This action cannot be undone.`)) {
      deleteFlow.mutate(flowId);
    }
  };

  if (isLoading) {
    return <FlowsLoading />;
  }

  if (!flows || flows.length === 0) {
    return <FlowsEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flows.map((flow) => (
        <FlowCard
          key={flow.id}
          flow={flow}
          onClick={() => navigateToPlayground(flow.id)}
          onDelete={handleDelete(flow.id, flow.name)}
        />
      ))}
    </div>
  );
};

export default FlowsList;

const FlowsLoading = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <p className="text-gray-500">Loading flows...</p>
    </div>
  );
};

const FlowsEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Workflow className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No flows yet</h3>
      <p className="text-gray-500">Get started by creating your first flow</p>
    </div>
  );
};