import { pipeline } from "@huggingface/transformers";
import { TextGenerationResult } from "./types";

export const generateResponse = async (input: string): Promise<string> => {
  try {
    const generator = await pipeline(
      'text-generation',
      'microsoft/DialoGPT-small',
      { 
        device: "webgpu"
      }
    );

    const prompt = `Answer this question about IBF certification: ${input}
    Context: IBF certification requires 75% TSCs coverage, completion of IBF-STS accredited courses, and application within 5 years.
    Level 1 (Qualified) has no minimum experience, Level 2 needs 3-7 years, Level 3 needs 8+ years.`;

    const result = await generator(prompt, {
      max_length: 100,
      num_return_sequences: 1,
      temperature: 0.7,
      top_k: 50,
      top_p: 0.9,
    }) as TextGenerationResult | TextGenerationResult[];

    const generatedText = Array.isArray(result) 
      ? result[0]?.generated_text 
      : result?.generated_text;

    return generatedText?.split(prompt)[1]?.trim() || 
      "I apologize, but I couldn't generate a specific response. Please refer to the IBF guidelines for accurate information.";
  } catch (error) {
    console.error('Error generating response:', error);
    return "I apologize, but I'm having trouble processing your request. Please try again or refer to the IBF guidelines.";
  }
};