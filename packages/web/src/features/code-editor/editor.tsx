import { useState } from "react";
import Editor from "@monaco-editor/react";
import { codeTemplates } from "@/shared/mock-data/code-templates";

const CodeEditor = ({ selectedLanguage }: { selectedLanguage: string }) => {
  const [codeValues, setCodeValues] = useState(() => {
    const initialValues: Record<string, string> = {};
    codeTemplates.forEach((item) => {
      initialValues[item.language] = item.code;
    });
    return initialValues;
  });

  const currentCode = codeValues[selectedLanguage] || "";
  const currentFilename =
    codeTemplates.find((item) => item.language === selectedLanguage)
      ?.filename || "";
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCodeValues((prev) => ({
        ...prev,
        [selectedLanguage]: value,
      }));
    }
  };

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case "javascript":
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
              value={currentCode}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
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
