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