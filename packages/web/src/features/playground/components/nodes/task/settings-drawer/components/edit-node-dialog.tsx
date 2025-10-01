import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useWorkflowStore } from "@/shared/store/workflow";
import { SquarePen } from "lucide-react";
import { EditNodeSpecsForm } from "./edit-node-specs-form";
import { useState } from "react";



type EditNodeMetaDataProps = {
    nodeId: string;
};

type NodeMetaData = {
    title: string;
    description: string;
    nodeLanguage: string;
};


const EditNodeMetaData = ({ nodeId }: EditNodeMetaDataProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { getNodeById } = useWorkflowStore();
    const node = getNodeById(nodeId);
    console.log(node)
    const nodeData: NodeMetaData = {
        title: (node?.data?.title as string) || "",
        description: (node?.data?.description as string) || "",
        nodeLanguage:
            ((node?.data as any)?.executable?.language as string) || "python",
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    className="absolute top-0 right-0 m-4 rounded-full bg-blue-950 hover:bg-sky-700"
                >
                    <SquarePen />
                    Edit Node Meta Data
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-120">
                <DialogHeader>
                    <DialogTitle>Edit Node Specifications</DialogTitle>
                    <DialogDescription>
                        Change node's title, description, and coding language
                    </DialogDescription>
                </DialogHeader>
                <EditNodeSpecsForm initialValues={nodeData} setIsDialogOpen={setIsDialogOpen} />
            </DialogContent>
        </Dialog>
    );
};

export default EditNodeMetaData;
