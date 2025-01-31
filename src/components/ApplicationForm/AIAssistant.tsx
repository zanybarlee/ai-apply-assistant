import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { type Message } from "./Chat/types";
import { type AnalysisResult } from "./Chat/AITypes";
import { analyzeApplication } from "./Chat/ApplicationAnalyzer";
import { generateResponse } from "./Chat/ResponseGenerator";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./Chat/ChatHeader";
import { MessageList } from "./Chat/MessageList";
import { ChatInput } from "./Chat/ChatInput";
import { FloatingContainer } from "./Chat/FloatingContainer";

export const AIAssistant = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [position, setPosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth - 400 : 0, 
    y: 100 
  });
  const [size, setSize] = useState({ width: 320, height: 500 });

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
    <FloatingContainer
      isFloating={isFloating}
      initialPosition={position}
      initialSize={size}
      onPositionChange={(x, y) => setPosition({ x, y })}
      onSizeChange={(width, height) => setSize({ width, height })}
    >
      {isOpen ? (
        <ResizablePanelGroup 
          direction="horizontal"
          className="h-full"
        >
          <ResizablePanel 
            className={cn(
              "bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300 h-full",
              isEnlarged ? "w-[600px] h-[80vh]" : ""
            )}
            defaultSize={100}
          >
            <ChatHeader
              isFloating={isFloating}
              isEnlarged={isEnlarged}
              onFloat={() => setIsFloating(!isFloating)}
              onResize={() => setIsEnlarged(!isEnlarged)}
              onClose={() => setIsOpen(false)}
              onClear={clearChat}
            />
            
            <MessageList
              messages={messages}
              isLoading={isLoading}
              analysis={analysis}
            />

            <div className="p-4 border-t space-y-2 bg-white">
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
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 flex items-center justify-center bg-white text-secondary hover:bg-white/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </FloatingContainer>
  );
};