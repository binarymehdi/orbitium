import { codeTemplates } from "@/shared/mock-data/code-templates";


export const deduceFileName = (nodeId: string, nodeLanguage: string): string => {
  const extentionMap: Record<string, string> = {
    python: 'py',
    go: 'go',
    javascript: 'js',
    ruby: 'rb',
    r: 'R',
  }
  const output = `${nodeId}.${extentionMap[nodeLanguage] || 'txt'}`
  return output
};

export const getNewCodeLanguageTemplate = (newLanguage: string): string | undefined => {
  const template = codeTemplates.find((tpl) => (tpl.language === newLanguage))
  const templateCode = template?.code;
  return templateCode; 
} 