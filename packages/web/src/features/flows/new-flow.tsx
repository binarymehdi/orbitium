import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/shared/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useCreateFlow } from "@/shared/integrations/tanstack-query/flows";
import { workflows } from "@/shared/mock-data/initial-workflow-state";
import { useState } from "react";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flowType, setFlowType] = useState<"empty" | "template">("empty");

  const handleCreateFlow = async () => {
    try {
      const templateIndex = flowType === "empty" ? 1 : 0;
      const template = workflows[templateIndex];
      
      const newFlow = await createFlow.mutateAsync({
        name: title || template.name,
        description: description || template.description,
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
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter flow title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter flow description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="flow-type">Type</Label>
        <Select value={flowType} onValueChange={(value) => setFlowType(value as "empty" | "template")}>
          <SelectTrigger id="flow-type" className="w-full">
            <SelectValue placeholder="Select flow type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="empty">Empty Flow</SelectItem>
            <SelectItem value="template">Template</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleCreateFlow}
        disabled={createFlow.isPending || !title.trim()}
        className="w-full"
      >
        {createFlow.isPending ? "Creating..." : "Create Flow"}
      </Button>
    </div>
  );
};

export default CreateFlowDialog;