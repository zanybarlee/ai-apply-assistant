import { TextGenerationResult } from "./types";

interface Attachment {
  name: string;
  mimeType: string;
  size: string;
  content: string;
}

async function createAttachment(file: File): Promise<Attachment[]> {
  const formData = new FormData();
  formData.append('files', file);

  // Using the full URL for the API endpoint
  const response = await fetch(
    'http://localhost:3000/attachments/64a31085-2b80-455f-937d-ee5b8277e8dc/ibf-certification-session',
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload attachment');
  }

  return response.json();
}

export const generateResponse = async (input: string, files?: File[]): Promise<string> => {
  try {
    console.log('Starting response generation process...');
    
    let uploads = [];
    
    if (files && files.length > 0) {
      const attachments = await Promise.all(files.map(file => createAttachment(file)));
      uploads = attachments.flat().map(attachment => ({
        data: `data:${attachment.mimeType};base64,${attachment.content}`,
        type: 'file:full',
        name: attachment.name,
        mime: attachment.mimeType
      }));
    }

    const data = {
      question: input,
      chatId: "ibf-certification-session",
      uploads
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