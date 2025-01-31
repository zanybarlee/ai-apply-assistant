import { useState, useRef } from "react";
import { type Message } from "../types";
import { type AnalysisResult } from "../AITypes";
import { analyzeApplication } from "../ApplicationAnalyzer";
import { generateResponse } from "../ResponseGenerator";

export const useChatState = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm here to help you with your IBF certification application. Feel free to ask any questions about the process, requirements, or eligibility criteria."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
      setAnalysis([]);
      
      const fileMessages: Message[] = files.map(file => ({
        role: 'user',
        content: `Selected file: ${file.name}`,
        file: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      }));
      
      setMessages(prev => [...prev, ...fileMessages]);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm here to help you with your IBF certification application. Feel free to ask any questions about the process, requirements, or eligibility criteria."
      }
    ]);
    setInput('');
    setAnalysis([]);
    setSelectedFiles([]);
  };

  const handleSend = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateResponse(input, selectedFiles);
      const assistantMessage = {
        role: 'assistant' as const,
        content: responseText
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (input.toLowerCase().includes('analyze') || input.toLowerCase().includes('assessment')) {
        const analysisResults = await analyzeApplication(input);
        setAnalysis(analysisResults);
      }
    } catch (error) {
      console.error('Error in chat interaction:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: "I apologize, but I'm having trouble processing your request. Please try again or refer to the IBF guidelines for accurate information."
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setSelectedFiles([]);
  };

  return {
    fileInputRef,
    messages,
    input,
    isLoading,
    analysis,
    selectedFiles,
    setInput,
    handleFileChange,
    handleSend,
    clearChat
  };
};