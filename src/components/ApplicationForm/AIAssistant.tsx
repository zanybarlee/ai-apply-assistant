import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Paperclip, Trash2, File, Maximize2, Minimize2, Move } from "lucide-react";
import { ChatMessage } from "./Chat/ChatMessage";
import { ChatInput } from "./Chat/ChatInput";
import { type Message } from "./Chat/types";
import { AnalysisResults } from "./AnalysisResults";
import { analyzeApplication } from "./Chat/ApplicationAnalyzer";
import { generateResponse } from "./Chat/ResponseGenerator";
import { type AnalysisResult } from "./Chat/AITypes";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export const AIAssistant = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [size, setSize] = useState({ width: 320, height: 500 });

  const [position, setPosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth - 400 : 0, 
    y: 100 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFloating && e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const padding = 20;
      const maxX = window.innerWidth - size.width - padding;
      const maxY = window.innerHeight - size.height - padding;
      
      const newX = Math.max(padding, Math.min(e.clientX - dragStart.x, maxX));
      const newY = Math.max(padding, Math.min(e.clientY - dragStart.y, maxY));
      
      setPosition({
        x: newX,
        y: newY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isFloating) return;
    
    const resizeHandle = document.createElement('div');
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.width = '10px';
    resizeHandle.style.height = '10px';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.right = '0';
    resizeHandle.style.cursor = 'se-resize';
    
    const startResize = (e: MouseEvent) => {
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;
      
      const doResize = (e: MouseEvent) => {
        const newWidth = Math.max(280, Math.min(800, startWidth + (e.clientX - startX)));
        const newHeight = Math.max(400, Math.min(window.innerHeight * 0.9, startHeight + (e.clientY - startY)));
        setSize({ width: newWidth, height: newHeight });
      };
      
      const stopResize = () => {
        window.removeEventListener('mousemove', doResize);
        window.removeEventListener('mouseup', stopResize);
      };
      
      window.addEventListener('mousemove', doResize);
      window.addEventListener('mouseup', stopResize);
    };
    
    resizeHandle.addEventListener('mousedown', startResize as any);
    if (chatRef.current) {
      chatRef.current.appendChild(resizeHandle);
    }
  };

  const toggleFloat = () => {
    if (!isFloating) {
      const padding = 20;
      setPosition({ 
        x: window.innerWidth - size.width - padding, 
        y: 100 
      });
    }
    setIsFloating(!isFloating);
  };

  useEffect(() => {
    if (isFloating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      if (chatRef.current) {
        chatRef.current.style.resize = 'both';
        chatRef.current.style.overflow = 'auto';
        handleResize(new MouseEvent('resize'));
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (chatRef.current) {
          chatRef.current.style.resize = 'none';
          const resizeHandle = chatRef.current.querySelector('.resize-handle');
          if (resizeHandle) {
            resizeHandle.remove();
          }
        }
      };
    }
  }, [isFloating, isDragging]);

  return (
    <div 
      ref={chatRef}
      className={cn(
        "fixed",
        isFloating ? "cursor-move" : "bottom-4 right-4",
        isFloating && "resize-handle"
      )}
      style={isFloating ? {
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        minWidth: '280px',
        minHeight: '400px',
        maxWidth: '800px',
        maxHeight: '90vh',
        transition: isDragging ? 'none' : 'all 0.3s ease-out',
        zIndex: 9999,
        resize: 'both',
        overflow: 'auto'
      } : undefined}
      onMouseDown={handleMouseDown}
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
            <div 
              className="p-4 border-b flex justify-between items-center"
              onMouseDown={handleMouseDown}
            >
              <h3 className="font-semibold">IBF Certification Assistant</h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleFloat}
                  title={isFloating ? "Dock" : "Float"}
                >
                  <Move className="h-4 w-4 text-gray-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsEnlarged(!isEnlarged)}
                  title={isEnlarged ? "Minimize" : "Maximize"}
                >
                  {isEnlarged ? (
                    <Minimize2 className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Maximize2 className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setMessages([{
                      role: 'assistant',
                      content: "Hello! I'm here to help you with your IBF certification application. Feel free to ask any questions about the process, requirements, or eligibility criteria."
                    }]);
                    setInput('');
                    setAnalysis([]);
                    setSelectedFiles([]);
                    toast({
                      title: "Chat Cleared",
                      description: "The chat history has been cleared.",
                    });
                  }}
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
          </ResizablePanel>
        </ResizablePanelGroup>
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