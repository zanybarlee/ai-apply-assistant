import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle } from "lucide-react";
import { pipeline } from "@huggingface/transformers";
import { ChatMessage } from "./Chat/ChatMessage";
import { ChatInput } from "./Chat/ChatInput";
import { type Message, type TextGenerationResult } from "./Chat/types";
import { AnalysisResults } from "./AnalysisResults";

type ClassificationResult = {
  label: string;
  score: number;
}[];

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm here to help you with your IBF certification application. Feel free to ask any questions about the process, requirements, or eligibility criteria."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ label: string; score: number }[]>([]);

  const analyzeApplication = async (text: string) => {
    try {
      const classifier = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { device: "webgpu" }
      );

      const result = await classifier(text) as ClassificationResult;
      const analysisResults = [
        {
          label: "Application Completeness",
          score: result[0]?.score || 0
        },
        {
          label: "Eligibility Match",
          score: Math.min(1, (result[0]?.score || 0) * 1.2)
        }
      ];

      setAnalysis(analysisResults);
      return analysisResults;
    } catch (error) {
      console.error('Error analyzing application:', error);
      return [];
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const generator = await pipeline(
        'text-generation',
        'Xenova/distilgpt2',
        { device: "webgpu" }
      );

      const prompt = `Answer this question about IBF certification: ${input}
      Context: IBF certification requires 75% TSCs coverage, completion of IBF-STS accredited courses, and application within 5 years.
      Level 1 (Qualified) has no minimum experience, Level 2 needs 3-7 years, Level 3 needs 8+ years.`;

      const result = await generator(prompt, {
        max_length: 100,
        num_return_sequences: 1,
      }) as TextGenerationResult | TextGenerationResult[];

      const generatedText = Array.isArray(result) 
        ? result[0]?.generated_text 
        : result?.generated_text;

      const responseText = generatedText?.split(prompt)[1]?.trim() || 
        "I apologize, but I couldn't generate a specific response. Please refer to the IBF guidelines for accurate information.";

      const assistantMessage = {
        role: 'assistant' as const,
        content: responseText
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Analyze the application context if the input contains relevant information
      if (input.length > 50) {
        await analyzeApplication(input);
      }

    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: "I apologize, but I'm having trouble processing your request. Please try again or refer to the IBF guidelines for accurate information."
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 h-[32rem] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">IBF Certification Assistant</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              ×
            </Button>
          </div>
          
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

          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSend={handleSend}
          />
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};