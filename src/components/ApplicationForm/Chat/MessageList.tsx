import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { AnalysisResults } from "../AnalysisResults";
import { type Message } from "./types";
import { type AnalysisResult } from "./AITypes";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  analysis: AnalysisResult[];
}

export const MessageList = ({ messages, isLoading, analysis }: MessageListProps) => {
  return (
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
  );
};