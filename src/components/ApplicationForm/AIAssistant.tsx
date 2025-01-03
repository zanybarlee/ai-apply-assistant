import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send } from "lucide-react";
import { pipeline } from "@huggingface/transformers";

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface TextGenerationResult {
  generated_text: string;
}

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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const generator = await pipeline(
        'text-generation',
        'onnx-community/distilgpt2',
        { device: 'cpu' }
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
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">IBF Certification Assistant</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              ×
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'assistant' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.role === 'assistant'
                        ? 'bg-gray-100'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
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