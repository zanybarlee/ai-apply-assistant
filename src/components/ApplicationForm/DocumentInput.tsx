import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface DocumentInputProps {
  text: string;
  isAnalyzing: boolean;
  onTextChange: (text: string) => void;
  onAnalyze: () => void;
}

export const DocumentInput = ({ 
  text, 
  isAnalyzing, 
  onTextChange, 
  onAnalyze 
}: DocumentInputProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="document">Document Text</Label>
        <Textarea
          id="document"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste your document text here for analysis..."
          className="min-h-[200px]"
        />
      </div>

      <Button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Document"
        )}
      </Button>
    </div>
  );
};