import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  category: string;
  confidence: number;
  explanation: string;
}

export const DocumentAnalyzer = () => {
  const [document, setDocument] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeDocument = async () => {
    if (!document.trim()) {
      toast({
        title: "Empty Document",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert at analyzing financial certification documents. Analyze the given text and categorize it based on relevance to financial certification, identifying key competencies and areas of expertise.",
            },
            {
              role: "user",
              content: document,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze document");
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      // Store the analysis in Supabase
      const { error: dbError } = await supabase
        .from("document_analyses")
        .insert({
          document_text: document,
          analysis_results: { analysis },
        });

      if (dbError) {
        console.error("Error storing analysis:", dbError);
        throw new Error("Failed to store analysis");
      }

      toast({
        title: "Analysis Complete",
        description: "Document has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="document">Document Text</Label>
          <Textarea
            id="document"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
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
      </div>
    </Card>
  );
};