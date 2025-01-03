import { TextGenerationResult, ServiceConfigResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const generateResponse = async (input: string): Promise<string> => {
  try {
    console.log('Starting response generation process...');
    
    // Fetch the API key from application_settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('application_settings')
      .select('*')
      .eq('key', 'OPENAI_API_KEY')
      .single();

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      throw new Error('Failed to fetch API key from settings');
    }

    if (!settingsData || !settingsData.value) {
      console.error('API key not found in settings');
      throw new Error('OpenAI API key not found in settings');
    }

    console.log('API key retrieved successfully');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settingsData.value}`
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
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    console.log('Successfully received response from OpenAI');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateResponse:', error);
    return "I apologize, but I'm having trouble accessing my configuration. Please ensure the OpenAI API key is properly set in the application settings.";
  }
};