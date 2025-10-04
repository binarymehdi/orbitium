import { codeTemplates } from "@/shared/mock-data/code-templates";


export const deduceFileName = (nodeId: string, nodeLanguage: string): string => {
  const extentionMap: Record<string, string> = {
    python: 'py',
    go: 'go',
    javascript: 'js',
    ruby: 'rb',
  }
  const output = `${nodeId}.${extentionMap[nodeLanguage]}`
  return output
};

export const getNewCodeLanguageTemplate = (newLanguage: string) => {
  const template = codeTemplates.find((tpl) => (tpl.language === newLanguage))
  const templateCode = template?.code;
  return templateCode; 
} 