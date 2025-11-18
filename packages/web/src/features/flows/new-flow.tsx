import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/shared/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/shared/components/ui/button";
import { Plus, FileText, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateFlow } from "@/shared/integrations/tanstack-query/flows";
import { workflows } from "@/shared/mock-data/initial-workflow-state";

const CreateFlowDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="absolute top-0 right-0 m-2">
          <Plus />
          New Flow
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Flow</DialogTitle>
        </DialogHeader>
        <CreateFlowDialogContent />
      </DialogContent>
    </Dialog>
  );
};

const CreateFlowDialogContent = () => {
  const navigate = useNavigate();
  const createFlow = useCreateFlow();

  const handleInitializeFlow = async (templateIndex: number) => {
    try {
      const template = workflows[templateIndex];
      const newFlow = await createFlow.mutateAsync({
        name: template.name,
        description: template.description,
        data: {
          nodes: template.initialNodes,
          edges: template.initialEdges,
          ready: false,
        },
      });
      navigate({ to: `/flows/$id/playground`, params: { id: newFlow.id } });
    } catch (error) {
      console.error("Failed to create flow:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <button
        onClick={() => handleInitializeFlow(1)}
        disabled={createFlow.isPending}
        className="group relative overflow-hidden rounded-lg border-2 border-gray-200 p-6 transition-all hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-gradient-to-br from-blue-50 to-blue-100 p-4 transition-transform group-hover:scale-110">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg text-gray-900">Blank Flow</h3>
            <p className="mt-2 text-sm text-gray-500">
              Start from scratch with an empty workflow
            </p>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/0 to-blue-50/0 transition-all group-hover:from-blue-50/50 group-hover:to-blue-100/30" />
      </button>

      <button
        onClick={() => handleInitializeFlow(0)}
        disabled={createFlow.isPending}
        className="group relative overflow-hidden rounded-lg border-2 border-gray-200 p-6 transition-all hover:border-purple-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-gradient-to-br from-purple-50 to-purple-100 p-4 transition-transform group-hover:scale-110">
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg text-gray-900">Use Template</h3>
            <p className="mt-2 text-sm text-gray-500">
              Choose from pre-built workflow templates
            </p>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50/0 to-purple-50/0 transition-all group-hover:from-purple-50/50 group-hover:to-purple-100/30" />
      </button>
    </div>
  );
};

export default CreateFlowDialog;