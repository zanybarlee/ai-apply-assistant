import { TextGenerationResult, ServiceConfigResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const generateResponse = async (input: string): Promise<string> => {
  try {
    console.log('Starting response generation process...');
    
    // Fetch the API key from Supabase secrets using the get_service_config function
    const { data: configData, error: configError } = await supabase
      .rpc('get_service_config', { service_name: 'OPENAI_API_KEY' }) as { data: ServiceConfigResponse, error: any };

    if (configError) {
      console.error('Error fetching OpenAI API key:', configError);
      throw new Error('Failed to fetch OpenAI API key');
    }

    const apiKey = configData?.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not found in configuration');
      throw new Error('OpenAI API key not found');
    }

    console.log('API key retrieved successfully');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Successfully received response from OpenAI');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateResponse:', error);
    return "I apologize, but I'm having trouble accessing my configuration. Please ensure the OpenAI API key is properly set in the application settings.";
  }
};