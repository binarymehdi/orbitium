import { useState } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./language-selector";

const codeTemplates = [
  {
    language: "javascript",
    filename: "script.js",
    code: `function scriptToExecute(input) {
    /**
     * A generic processing function.
     * Input -> Output, chainable.
     */
    
    const output = {
        result: \`processed: \${JSON.stringify(input)}\`
    };
    
    return output;
}

// Example usage
const input = { data: "example" };
console.log(scriptToExecute(input));`,
  },
  {
    language: "python",
    filename: "script.py",
    code: `def script_to_execute(input_data):
    """
    A generic processing function.
    The input should match the expected structure,
    and the output should be usable by the next step.
    """

    # Example placeholder logic
    output = {
        "result": f"processed: {input_data}"
    }

    return output


if __name__ == "__main__":
    sample_input = {"data": "example"}
    print(script_to_execute(sample_input))`,
  },
  {
    language: "go",
    filename: "script.go",
    code: `package main

import (
    "fmt"
)

// ScriptToExecute processes input and returns output
func ScriptToExecute(input map[string]interface{}) map[string]interface{} {
    output := map[string]interface{}{
        "result": fmt.Sprintf("processed: %v", input),
    }
    return output
}

func main() {
    input := map[string]interface{}{"data": "example"}
    output := ScriptToExecute(input)
    fmt.Println(output)
}`,
  },
  {
    language: "ruby",
    filename: "script.rb",
    code: `def script_to_execute(input)
  # A generic processing function.
  # Input -> Output, chainable.

  output = {
    result: "processed: #{input}"
  }

  return output
end

# Example usage
input = { data: "example" }
puts script_to_execute(input)`,
  },
];

const CodeEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [codeValues, setCodeValues] = useState(() => {
    const initialValues: Record<string, string> = {};
    codeTemplates.forEach((item) => {
      initialValues[item.language] = item.code;
    });
    return initialValues;
  });

  const currentCode = codeValues[selectedLanguage] || "";
  const currentFilename =
    codeTemplates.find((item) => item.language === selectedLanguage)?.filename || "";

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };
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
            <LanguageSelector
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
            />
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
