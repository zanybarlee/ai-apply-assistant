import { supabase } from "@/integrations/supabase/client";

export const uploadDocumentToStorage = async (file: File, fileName: string) => {
  const { error: uploadError } = await supabase.storage
    .from('certification_documents')
    .upload(fileName, file);

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }
};

export const saveDocumentAnalysis = async (text: string) => {
  const { error: dbError } = await supabase
    .from('document_analyses')
    .insert([{
      document_text: text,
      analysis_results: { status: 'processed' }
    }]);

  if (dbError) {
    throw new Error(`Failed to store analysis: ${dbError.message}`);
  }
};