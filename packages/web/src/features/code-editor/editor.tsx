import Editor from "@monaco-editor/react";
import { useWorkflowStore } from "@/shared/store/workflow";

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

type CodeEditorProps = {
   nodeId: string
   onCodeChange: (code: string) => void
}

const CodeEditor = ({ nodeId, onCodeChange }: CodeEditorProps) => {

  const { getNodeById } = useWorkflowStore();
  const node = getNodeById(nodeId);

  const selectedLanguage = (node?.data as WorkflowNodeData)?.executable.language;
  const initialCode = (node?.data as WorkflowNodeData)?.executable.code;
  const useDeduceFileName = (nodeId: string, nodeLanguage: string): string => {
    
    const extentionMap: Record<string, string> =  {
      python: 'py',
      go: 'go',
      javascript: 'js',
      ruby: 'rb',
    }
    const output = `${nodeId}.${extentionMap[nodeLanguage]}`
    console.log(output);
    return output
  }
  const currentFilename = useDeduceFileName(nodeId, selectedLanguage);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      onCodeChange(value);
      console.log("value from editor", value)
    }
  };

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case "javacript":
        return "javascript";
      case "python":
        return "python";
      case "go":
        return "go";
      case "ruby":
        return "ruby";
      default:
        return "plaintext";
    }
  };

  return (
    <div className="py-10">
      <div className="flex w-full flex-col gap-1 overflow-hidden">
        <div className="bg-muted/40 w-full rounded-md border">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="text-muted-foreground text-sm font-medium">
              {currentFilename}
            </div>
          </div>

          <div className="m-1 h-132 rounded-2xl">
            <Editor
              height="100%"
              language={getMonacoLanguage(selectedLanguage)}
              value={initialCode}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: true },
                fontSize: 16,
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderWhitespace: "selection",
                tabSize: 2,
                insertSpaces: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
