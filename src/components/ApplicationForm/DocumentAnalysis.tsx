import { useState } from "react";
import { pipeline } from "@huggingface/transformers";
import { useToast } from "@/hooks/use-toast";
import { DocumentInput } from "./DocumentInput";
import { DocumentUpload } from "./DocumentUpload";
import { AnalysisResults } from "./AnalysisResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extractTextFromPdf } from "@/utils/pdfUtils";

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
      const classifier = await pipeline(
        "zero-shot-classification",
        "Xenova/bart-large-mnli",
        {
          device: "webgpu",
          revision: "main"
        }
      );

      const labels = [
        "Financial Experience",
        "Technical Skills",
        "Professional Certification",
        "Project Management",
        "Risk Management",
        "Compliance",
      ];

      console.log("Starting classification...");
      const result = await classifier(text, labels, {
        multi_label: true,
        hypothesis_template: "This text is about {}."
      }) as ZeroShotResult;

      console.log("Classification result:", result);

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

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const extractedText = await extractTextFromPdf(file);
      setText(extractedText);
      return extractedText;
    } catch (error) {
      console.error('Error extracting text:', error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract text from the document. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Enter Text</TabsTrigger>
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <DocumentInput
            text={text}
            isAnalyzing={isAnalyzing}
            onTextChange={setText}
            onAnalyze={analyzeDocument}
          />
        </TabsContent>
        <TabsContent value="upload">
          <DocumentUpload onTextExtracted={handleFileUpload} />
        </TabsContent>
      </Tabs>
      <AnalysisResults analysis={analysis} />
    </div>
  );
};