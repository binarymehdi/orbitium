import LanguageSelector from "@/features/code-editor/language-selector";
import { Button } from "@/shared/components/ui/button";
import { DialogFooter } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
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

export const AddNodeForm = ({ data, setIsDialogOpen }: any) => {
    console.log(data)    
    const form = useAppForm({
        
        validators: {
            onChange: z.object({
                title: z.string(),
                description: z.string(),
                nodeLanguage: z.string(),
            }),
        },
        onSubmit: ({ value }) => {
            console.log(value)
            // updateNodeMetaData(nodeId, {
            //     title: value.title,
            //     description: value.description,
            // });
            // if (initialValues.nodeLanguage !== value.nodeLanguage) {
            //     changeNodeBaseLanguage(nodeId, value.nodeLanguage)
            // }
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
                                value="javascript"
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
                    <form.Button>Add new Task Node</form.Button>
                </DialogFooter>
            </form.AppForm>
        </form>
    );
};
