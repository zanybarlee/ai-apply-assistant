export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export interface TextGenerationResult {
  generated_text: string;
}

export interface ServiceConfigResponse {
  [key: string]: string;
}

export interface FileUpload {
  data: string;
  type: string;
  name: string;
  mime: string;
}

export interface ChatRequest {
  question: string;
  chatId: string;
  uploads: FileUpload[];
}