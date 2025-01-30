import { Button } from "@/components/ui/button";
import { Move, Minimize2, Maximize2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChatHeaderProps {
  isFloating: boolean;
  isEnlarged: boolean;
  onFloat: () => void;
  onResize: () => void;
  onClose: () => void;
  onClear: () => void;
}

export const ChatHeader = ({
  isFloating,
  isEnlarged,
  onFloat,
  onResize,
  onClose,
  onClear,
}: ChatHeaderProps) => {
  const { toast } = useToast();

  const handleClear = () => {
    onClear();
    toast({
      title: "Chat Cleared",
      description: "The chat history has been cleared.",
    });
  };

  return (
    <div className="p-4 border-b flex justify-between items-center">
      <h3 className="font-semibold">IBF Certification Assistant</h3>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onFloat}
          title={isFloating ? "Dock" : "Float"}
        >
          <Move className="h-4 w-4 text-gray-500" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onResize}
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
          onClick={handleClear}
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4 text-gray-500" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
        >
          ×
        </Button>
      </div>
    </div>
  );
};