import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { AddNodeForm } from "./add-node-specs-form";



const AddNewNodeDialog = ({isDialogOpen, setIsDialogOpen}: any) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-120">
                <DialogHeader>
                    <DialogTitle>Add New Node</DialogTitle>
                    <DialogDescription>
                        Change node's title, description, and coding language
                    </DialogDescription>
                </DialogHeader>
                <AddNodeForm 
                    setIsDialogOpen={setIsDialogOpen} 
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddNewNodeDialog;
