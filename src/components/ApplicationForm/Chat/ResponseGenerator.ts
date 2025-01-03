import { TextGenerationResult, ServiceConfigResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const generateResponse = async (input: string): Promise<string> => {
  try {
    // Fetch the API key from Supabase config
    const { data, error } = await supabase
      .rpc('get_service_config', {
        service_name: 'OPENAI_API_KEY'
      });

    if (error || !data || typeof data !== 'object') {
      console.error('Error fetching OpenAI API key:', error);
      return "I apologize, but I'm having trouble accessing my configuration. Please try again in a moment.";
    }

    // Safely type check and extract the API key
    const config = {
      OPENAI_API_KEY: Object.values(data)[0] as string
    };

    if (!config.OPENAI_API_KEY) {
      console.error('OpenAI API key not found in config');
      return "I apologize, but I'm having trouble accessing my configuration. Please try again in a moment.";
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.OPENAI_API_KEY}`
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