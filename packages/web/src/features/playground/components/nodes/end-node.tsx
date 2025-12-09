import { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, XCircle, X, FileText } from 'lucide-react';
import { useWorkflowStore } from '@/shared/store/workflow';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/shared/components/ui/drawer";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

export const EndNode = memo(function EndNode() {
    const { executionOutput, executionSuccess } = useWorkflowStore();
    const hasOutput = executionOutput !== null;
    const [isOpen, setIsOpen] = useState(false);
    
    useEffect(() => {
        if (!hasOutput) {
            setIsOpen(false);
        }
    }, [hasOutput]);
    
    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(true);
    };
    
    return (
        <>
            <div className="relative">
                <div className='px-2 cursor-pointer py-1 rounded-full bg-orange-500 border-1 border-sky-700 w-20'>
                    <div className='flex flex-row items-center justify-center px-1 gap-1'>
                        <h1 className='text-white text-sm'>End</h1>
                    </div>
                    <Handle
                        type="target"
                        position={Position.Top}
                        className="w-16 !bg-teal-500"
                    />
                </div>
                
                {hasOutput && (
                    <button
                        onClick={handleIconClick}
                        className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 shadow-lg cursor-pointer hover:scale-110 transition-transform z-50"
                    >
                        <FileText className="h-4 w-4 text-white" />
                    </button>
                )}
            </div>
            
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="flex items-center gap-2">
                            {executionSuccess ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                                <XCircle className="h-5 w-5 text-rose-500" />
                            )}
                            Pipeline Execution Output
                        </DrawerTitle>
                        <DrawerDescription>
                            {executionSuccess 
                                ? 'Pipeline completed successfully. View the data flow output below.'
                                : 'Pipeline execution failed. Check the output for errors.'
                            }
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                        <ScrollArea className="h-[50vh]">
                            <pre className="text-sm font-mono bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                                {executionOutput}
                            </pre>
                        </ScrollArea>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" className="gap-2">
                                <X className="h-4 w-4" />
                                Close
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
});
