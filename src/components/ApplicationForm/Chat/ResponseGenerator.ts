import { TextGenerationResult } from "./types";
import { supabase } from "@/integrations/supabase/client";

interface ServiceConfigResponse {
  data: { OPENAI_API_KEY: string } | null;
  error: Error | null;
}

export const generateResponse = async (input: string): Promise<string> => {
  try {
    // Fetch the API key from Supabase config
    const { data, error: configError } = await supabase
      .rpc('get_service_config', {
        service_name: 'OPENAI_API_KEY'
      }) as unknown as ServiceConfigResponse;

    if (configError || !data?.OPENAI_API_KEY) {
      console.error('Error fetching OpenAI API key:', configError);
      return "Please ensure your OpenAI API key is properly configured in the project settings.";
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.OPENAI_API_KEY}`
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

    const data_response = await response.json();
    return data_response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I apologize, but I'm having trouble processing your request. Please try again or refer to the IBF guidelines.";
  }
};