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

  try {
    console.log('Starting attachment upload...');
    
    const response = await fetch(
      'http://localhost:3000/attachments/64a31085-2b80-455f-937d-ee5b8277e8dc/ibf-certification-session',
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload attachment: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error('Unexpected response type:', contentType);
      throw new Error('Server responded with non-JSON content');
    }

    const data = await response.json();
    console.log('Attachment upload successful:', data);
    return data;
  } catch (error) {
    console.error('Error in createAttachment:', error);
    throw error;
  }
}

export const generateResponse = async (input: string, files?: File[]): Promise<string> => {
  try {
    console.log('Starting response generation process...');
    
    let uploads = [];
    
    if (files && files.length > 0) {
      console.log('Processing files:', files.map(f => f.name));
      const attachments = await Promise.all(files.map(file => createAttachment(file)));
      uploads = attachments.flat().map(attachment => ({
        data: `data:${attachment.mimeType};base64,${attachment.content}`,
        type: 'file:full',
        name: attachment.name,
        mime: attachment.mimeType
      }));
      console.log('Files processed successfully');
    }

    const requestData = {
      question: input,
      chatId: "ibf-certification-session",
      uploads
    };

    console.log('Sending request to prediction API...');
    const response = await fetch(
      "http://localhost:3000/api/v1/prediction/64a31085-2b80-455f-937d-ee5b8277e8dc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error('Unexpected response type:', contentType);
      throw new Error('Server responded with non-JSON content');
    }

    const data = await response.json();
    console.log('Successfully received response from API');
    
    return data.text || "I apologize, but I couldn't process your request at this time.";
  } catch (error) {
    console.error('Error in generateResponse:', error);
    return "I apologize, but I'm having trouble accessing the API. Please ensure the local server is running on port 3000 and try again.";
  }
};