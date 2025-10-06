import LanguageSelector from "@/features/code-editor/language-selector";
import { Button } from "@/shared/components/ui/button";
import { DialogFooter } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useWorkflowStore } from "@/shared/store/workflow";
import { DialogClose } from "@radix-ui/react-dialog";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { z } from "zod";

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
    fieldComponents: {
        Input,
        Textarea,
        LanguageSelector
    },
    formComponents: {
        Button,
    },
    fieldContext,
    formContext,
});

type AddNodeFormProps = {
    setIsDialogOpen: (open: boolean) => void;
    edgeId: string;
};

export const AddNodeForm = ({ setIsDialogOpen, edgeId }: AddNodeFormProps) => {
    const { addNodeOnEdge } = useWorkflowStore();
    
    const form = useAppForm({
        defaultValues: {
            title: "",
            description: "",
            nodeLanguage: "",
        },
        validators: {
            onChange: z.object({
                title: z.string().min(1, "Title is required"),
                description: z.string().min(1, "Description is required"),
                nodeLanguage: z.string(),
            }),
        },
        onSubmit: ({ value }) => {
            addNodeOnEdge(edgeId, {
                title: value.title,
                description: value.description,
                language: value.nodeLanguage,
            });
            setIsDialogOpen(false);
        },
    });
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="title">Title</Label>
                    <form.AppField
                        name="title"
                        children={(field) => (
                            <field.Input
                                id="title"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Enter node title"
                            />
                        )}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <form.AppField
                        name="description"
                        children={(field) => (
                            <field.Textarea
                                id="description"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Enter node description"
                            />
                        )}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="language">Node Language</Label>
                    <form.AppField
                        name="nodeLanguage"
                        children={(field) => (
                            <field.LanguageSelector
                                value={field.state.value}
                                onValueChange={(value) => field.handleChange(value)}
                                isNewNode={true}
                            />
                        )}
                    />
                </div>
            </div>
            <form.AppForm>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <form.Button>Add Task Node</form.Button>
                </DialogFooter>
            </form.AppForm>
        </form>
    );
};
