import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { AddNodeForm } from "./add-node-specs-form";

type AddNewNodeDialogProps = {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    edgeId: string;
};

const AddNewNodeDialog = ({ isDialogOpen, setIsDialogOpen, edgeId }: AddNewNodeDialogProps) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-120">
                <DialogHeader>
                    <DialogTitle>Add New Node</DialogTitle>
                    <DialogDescription>
                        Set the node's title, description, and coding language
                    </DialogDescription>
                </DialogHeader>
                <AddNodeForm 
                    setIsDialogOpen={setIsDialogOpen}
                    edgeId={edgeId}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddNewNodeDialog;
