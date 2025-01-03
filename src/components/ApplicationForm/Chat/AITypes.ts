import { Message, TextGenerationResult } from "./types";

export interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AnalysisResult {
  label: string;
  score: number;
}

export type ClassificationResult = {
  label: string;
  score: number;
}[];

export interface AIState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  analysis: AnalysisResult[];
}