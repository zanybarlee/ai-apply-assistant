import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, File } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export const ChatInput = ({ input, isLoading, onInputChange, onSend }: ChatInputProps) => {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <File className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
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