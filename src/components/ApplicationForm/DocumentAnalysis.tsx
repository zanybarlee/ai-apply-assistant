import { useState } from "react";
import { pipeline } from "@huggingface/transformers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type ZeroShotResult = {
  sequence: string;
  labels: string[];
  scores: number[];
};

export const DocumentAnalysis = () => {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<{ label: string; score: number }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeDocument = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty Document",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Initialize the zero-shot classification pipeline
      const classifier = await pipeline(
        "zero-shot-classification",
        "Xenova/bart-large-mnli",
        {
          device: "webgpu",
          revision: "main"
        }
      );

      // Define possible categories relevant to IBF certification
      const labels = [
        "Financial Experience",
        "Technical Skills",
        "Professional Certification",
        "Project Management",
        "Risk Management",
        "Compliance",
      ];

      console.log("Starting classification...");
      // Perform classification
      const result = await classifier(text, labels, {
        multi_label: true,
        hypothesis_template: "This text is about {}."
      }) as ZeroShotResult;

      console.log("Classification result:", result);

      // Format and set results
      const formattedResults = result.labels.map((label, index) => ({
        label,
        score: Number(result.scores[index]),
      })).sort((a, b) => b.score - a.score);

      setAnalysis(formattedResults);
      
      toast({
        title: "Analysis Complete",
        description: "Document has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="document">Document Text</Label>
        <Textarea
          id="document"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your document text here for analysis..."
          className="min-h-[200px]"
        />
      </div>

      <Button
        onClick={analyzeDocument}
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

      {analysis.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Analysis Results</h3>
          <div className="space-y-2">
            {analysis.map((result, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{result.label}</span>
                <span className="text-sm font-mono">
                  {(result.score * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};