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

export const EditNodeSpecsForm = ({ initialValues, setIsDialogOpen, nodeId }: any) => {
    const { updateNodeMetaData, setNodeBaseLanguage } = useWorkflowStore();
    
    const form = useAppForm({
        defaultValues: {
            title: initialValues?.title || "",
            description: initialValues?.description || "",
            nodeLanguage: initialValues?.nodeLanguage || "python",
        },
        validators: {
            onChange: z.object({
                title: z.string(),
                description: z.string(),
                nodeLanguage: z.string(),
            }),
        },
        onSubmit: ({ value }) => {
            updateNodeMetaData(nodeId, {
                title: value.title,
                description: value.description,
            });
            if (initialValues.nodeLanguage !== value.nodeLanguage) {
                setNodeBaseLanguage(nodeId, value.nodeLanguage)
            }
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
                    <Label htmlFor="name-1">Title</Label>
                    <form.AppField
                        name="title"
                        children={(field) => (
                            <field.Input
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        )}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="username-1">Description</Label>
                    <form.AppField
                        name="description"
                        children={(field) => (
                            <field.Textarea
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        )}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="name-1">Node Language</Label>
                    <form.AppField
                        name="nodeLanguage"
                        children={(field) => (
                            <field.LanguageSelector
                                value={field.state.value}
                                onValueChange={(value) => field.handleChange(value)}
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
                    <form.Button>Submit</form.Button>
                </DialogFooter>
            </form.AppForm>
        </form>
    );
};
