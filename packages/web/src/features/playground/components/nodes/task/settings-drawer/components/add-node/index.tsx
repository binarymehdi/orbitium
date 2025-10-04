import CodeEditor from "@/features/code-editor/editor";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import { useWorkflowStore } from "@/shared/store/workflow";
import { Save, TriangleAlert } from "lucide-react";
import { useState } from "react";
import EditNodeMetaData from "./components/edit-node/edit-node-dialog";

// Define the node data structure
type NodeExecutable = {
  language: string;
  code: string;
};

type WorkflowNodeData = {
  title: string;
  nodeType: string;
  description: string;
  executable: NodeExecutable;
};

interface NodeSpecsDrawerProps {
  nodeId: string;
}

export default function NodeSpecsDrawer({ nodeId }: NodeSpecsDrawerProps) {
  const { getNodeById, updateNodeCode } = useWorkflowStore();
  const node = getNodeById(nodeId);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [currentCode, setCurrentCode] = useState<string>("");

  const nodeData = node?.data as WorkflowNodeData;
  const nodeTitle = nodeData?.title || `Node ${nodeId}`;
  const nodeDescription = nodeData?.description || "Configure node settings";

  const handleDelete = () => {
    setIsDrawerOpen(false);
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
  };

  const useOpenNodeSpecs = (): boolean => {
    setIsDrawerOpen(true);
    return true;
  };

  if (!nodeData) {
    return null;
  }

  const handleSave = () => {
    updateNodeCode(nodeId, currentCode);
    setIsDrawerOpen(false);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <button
            className="nodrag cursor-pointer"
            onClick={useOpenNodeSpecs}
            aria-hidden="false"
            aria-label={`Open settings for node ${nodeId}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-settings2-icon lucide-settings-2"
            >
              <path d="M14 17H5" />
              <path d="M19 7h-9" />
              <circle cx="17" cy="17" r="3" />
              <circle cx="7" cy="7" r="3" />
            </svg>
          </button>
        </DrawerTrigger>
        <DrawerContent className="h-full w-1/2">
          <DrawerHeader className="p-4">
            <DrawerTitle className="text-2xl">{nodeTitle}</DrawerTitle>
            <DrawerDescription>{nodeDescription}</DrawerDescription>
            <EditNodeMetaData nodeId={nodeId} />
            {/* the handleCodeChange is there as the save button is in the parent of the CodeEditor */}
            {/* the change code template action shall change the code as well */}
            <CodeEditor nodeId={nodeId} onCodeChange={handleCodeChange} />
          </DrawerHeader>
          <DrawerFooter className="flex flex-row">
            <Button
              onClick={handleSave}
              className="rounded-full px-4"
            >
              <Save />
              Apply Code Changes
            </Button>
            <Button
              variant='secondary'
              onClick={handleDelete}
              className="w-36 rounded-full"
            >
              <TriangleAlert />
              Delete Node
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
