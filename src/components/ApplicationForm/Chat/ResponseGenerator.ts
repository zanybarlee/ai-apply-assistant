import { TextGenerationResult, ServiceConfigResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const generateResponse = async (input: string): Promise<string> => {
  try {
    console.log('Starting response generation process...');
    
    // Fetch the API key directly from application_settings
    const { data, error } = await supabase
      .from('application_settings')
      .select('value')
      .eq('key', 'OPENAI_API_KEY')
      .single();

    if (error) {
      console.error('Error fetching OpenAI API key:', error);
      return "I apologize, but I'm having trouble accessing my configuration. Please try again in a moment.";
    }

    if (!data?.value) {
      console.error('OpenAI API key not found or empty');
      return "I apologize, but the OpenAI API key appears to be missing or invalid. Please ensure it's properly configured.";
    }

    console.log('Making request to OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.value}`
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
      return "I apologize, but I'm having trouble processing your request. Please try again or refer to the IBF guidelines.";
    }

    const data_response = await response.json();
    console.log('Successfully received response from OpenAI');
    return data_response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I apologize, but I'm having trouble processing your request. Please try again or refer to the IBF guidelines.";
  }
};