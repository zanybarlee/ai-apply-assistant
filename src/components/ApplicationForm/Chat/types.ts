export interface Message {
  role: 'user' | 'assistant';
  content: string;
  file?: {
    name: string;
    size: number;
    type: string;
  };
}

export interface TextGenerationResult {
  text: string;
}