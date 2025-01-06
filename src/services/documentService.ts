import { supabase } from "@/integrations/supabase/client";

export const uploadDocumentToStorage = async (file: File, fileName: string) => {
  const { error: uploadError } = await supabase.storage
    .from('certification_documents')
    .upload(fileName, file);

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }
};