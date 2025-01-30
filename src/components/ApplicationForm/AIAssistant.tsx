import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Paperclip, Trash2, File } from "lucide-react";
import { ChatMessage } from "./Chat/ChatMessage";
import { ChatInput } from "./Chat/ChatInput";
import { type Message } from "./Chat/types";
import { AnalysisResults } from "./AnalysisResults";
import { analyzeApplication } from "./Chat/ApplicationAnalyzer";
import { generateResponse } from "./Chat/ResponseGenerator";
import { type AnalysisResult } from "./Chat/AITypes";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const AIAssistant = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
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
      
      // Add file messages to the chat
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

  const handleFileClick = () => {
    fileInputRef.current?.click();
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
    toast({
      title: "Chat Cleared",
      description: "The chat history has been cleared.",
    });
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 h-[32rem] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">IBF Certification Assistant</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearChat}
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
              >
                ×
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    Thinking...
                  </div>
                </div>
              )}
              {analysis.length > 0 && (
                <AnalysisResults analysis={analysis} />
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSend={handleSend}
              onFileClick={handleFileClick}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};