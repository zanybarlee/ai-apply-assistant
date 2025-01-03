import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

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
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask a question..."
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
        />
        <Button onClick={onSend} disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};