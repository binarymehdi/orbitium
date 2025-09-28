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
import { Save, TriangleAlert } from "lucide-react";
import { useState } from "react";

interface NodeSpecsDrawerProps {
  nodeId: string;
}

export default function NodeSpecsDrawer({ nodeId }: NodeSpecsDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleDelete = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (): void => {
    setIsDrawerOpen(false);
    console.log("edit handeled");
  };

  const useOpenNodeSpecs = (nodeId: string): boolean => {
    setIsDrawerOpen(true);
    console.log("dialog for node opened node: ", nodeId);
    return true;
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Drawer direction="right" open={isDrawerOpen}>
        <DrawerTrigger asChild>
          <button
            className="nodrag cursor-pointer"
            onClick={() => useOpenNodeSpecs(nodeId)}
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
            <DrawerTitle className="text-2xl">Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            <div className="h-[80vh]">
              <p className="text-muted-foreground text-sm">
                Perfect for shopping carts or settings panels.
              </p>
            </div>
          </DrawerHeader>
          <DrawerFooter className="flex flex-row">
              <Button
                onClick={handleEdit}
                className="w-40 rounded-full bg-blue-700 px-4"
              >
                <Save />
                Apply Changes
              </Button>
              <Button
                onClick={handleDelete}
                className="w-36 rounded-full bg-red-700"
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
