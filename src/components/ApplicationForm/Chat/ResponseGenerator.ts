import { TextGenerationResult, ServiceConfigResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const generateResponse = async (input: string): Promise<string> => {
  try {
    console.log('Starting response generation process...');
    
    // First, check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('application_settings')
      .select('key')
      .limit(1);

    if (testError) {
      console.error('Error connecting to Supabase:', testError);
      return "I apologize, but I'm having trouble connecting to the database. Please try again in a moment.";
    }

    console.log('Successfully connected to Supabase, fetching API key...');

    // Now fetch the API key
    const { data, error } = await supabase
      .from('application_settings')
      .select('value')
      .eq('key', 'OPENAI_API_KEY')
      .single();

    if (error) {
      console.error('Error fetching OpenAI API key:', error);
      return "I apologize, but I'm having trouble accessing my configuration. Please try again in a moment.";
    }

    console.log('API key fetch response:', {
      found: !!data,
      hasValue: !!(data && data.value),
      isEmpty: data && data.value ? data.value.trim() === '' : true
    });

    if (!data || !data.value) {
      console.error('OpenAI API key not found in application_settings');
      return "I apologize, but I'm having trouble accessing my configuration. Please ensure the OpenAI API key is properly set in the application settings.";
    }

    if (data.value.trim() === '') {
      console.error('OpenAI API key is empty');
      return "The OpenAI API key appears to be empty. Please set a valid API key in the application settings.";
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
      const error = await response.json();
      console.error('OpenAI API error:', error);
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