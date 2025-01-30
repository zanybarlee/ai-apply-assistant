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
    console.log('Starting text extraction...');
    
    const response = await fetch('http://localhost:8001/general/v0/general', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      console.error('Extraction failed with status:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Text extraction failed: ${response.status} ${response.statusText}`);
    }

    const elements = await response.json();
    console.log('Text extraction successful:', elements);

    // Extract plain text from elements
    const plainText = elements
      .filter((element: any) => element.text)
      .map((element: any) => element.text)
      .join('\n');

    // Create attachment object with extracted text
    return [{
      name: file.name,
      mimeType: file.type,
      size: file.size.toString(),
      content: plainText
    }];
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
      try {
        const attachments = await Promise.all(files.map(file => createAttachment(file)));
        uploads = attachments.flat().map(attachment => ({
          data: attachment.content,
          type: 'text',
          name: attachment.name,
          mime: attachment.mimeType
        }));
        console.log('Files processed successfully');
      } catch (error) {
        console.error('Error processing files:', error);
        throw new Error(`File processing failed: ${error.message}`);
      }
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
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestData)
      }
    );

    if (!response.ok) {
      console.error('Prediction API request failed:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error('Unexpected response type from prediction API:', contentType);
      const responseText = await response.text();
      console.error('Response body:', responseText);
      throw new Error(`Unexpected response type from prediction API: ${contentType}`);
    }

    const data = await response.json();
    console.log('Successfully received response from API');
    
    return data.text || "I apologize, but I couldn't process your request at this time.";
  } catch (error) {
    console.error('Error in generateResponse:', error);
    return "I apologize, but I'm having trouble accessing the API. Please ensure the unstructured API server is running on port 8001 and try again.";
  }
};