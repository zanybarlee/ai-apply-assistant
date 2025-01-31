import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { type Message } from "./types";
import { type AnalysisResult } from "./AITypes";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  analysis: AnalysisResult[];
  input: string;
  isEnlarged: boolean;
  isFloating: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onFileClick: () => void;
  onFloat: () => void;
  onResize: () => void;
  onClose: () => void;
  onClear: () => void;
}

export const ChatInterface = ({
  messages,
  isLoading,
  analysis,
  input,
  isEnlarged,
  isFloating,
  onInputChange,
  onSend,
  onFileClick,
  onFloat,
  onResize,
  onClose,
  onClear,
}: ChatInterfaceProps) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
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
          onFloat={onFloat}
          onResize={onResize}
          onClose={onClose}
          onClear={onClear}
        />
        
        <MessageList
          messages={messages}
          isLoading={isLoading}
          analysis={analysis}
        />

        <div className="p-4 border-t space-y-2">
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={onInputChange}
            onSend={onSend}
            onFileClick={onFileClick}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};