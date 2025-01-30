import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, File } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onFileClick: () => void;
}

export const ChatInput = ({ input, isLoading, onInputChange, onSend, onFileClick }: ChatInputProps) => {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <button 
            onClick={onFileClick}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <File className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
          </button>
          <Input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Ask a question..."
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && onSend()}
          />
        </div>
        <Button onClick={onSend} disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};