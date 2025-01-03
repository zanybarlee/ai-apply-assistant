import { TextGenerationResult } from "./types";

export const generateResponse = async (input: string): Promise<string> => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return "Please provide your OpenAI API key in the project settings to use the AI assistant.";
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides information about IBF certification. IBF certification requires 75% TSCs coverage, completion of IBF-STS accredited courses, and application within 5 years. Level 1 (Qualified) has no minimum experience, Level 2 needs 3-7 years, Level 3 needs 8+ years.'
          },
          {
            role: 'user',
            content: input
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return "I apologize, but I'm having trouble processing your request. Please try again or refer to the IBF guidelines.";
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I apologize, but I'm having trouble processing your request. Please try again or refer to the IBF guidelines.";
  }
};