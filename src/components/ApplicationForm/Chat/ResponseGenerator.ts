import { TextGenerationResult } from "./types";

export const generateResponse = async (input: string): Promise<string> => {
  try {
    console.log('Starting response generation process...');
    
    const data = {
      question: input,
      chatId: "ibf-certification-session", // Using a fixed session ID for now
      uploads: [] // No uploads for basic chat functionality
    };

    const response = await fetch(
      "http://localhost:3000/api/v1/prediction/64a31085-2b80-455f-937d-ee5b8277e8dc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Successfully received response from API');
    return result.text;
  } catch (error) {
    console.error('Error in generateResponse:', error);
    return "I apologize, but I'm having trouble accessing the API. Please try again later.";
  }
};