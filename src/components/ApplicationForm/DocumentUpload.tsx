import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DocumentUpload = ({ onTextExtracted }: { onTextExtracted: (text: string) => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      console.log('Starting file upload process...');
      
      // Upload file to Supabase Storage
      const fileName = `${crypto.randomUUID()}.pdf`;
      const { error: uploadError, data } = await supabase.storage
        .from('certification_documents')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certification_documents')
        .getPublicUrl(fileName);

      console.log('File uploaded successfully, URL:', publicUrl);

      // Process the PDF using Edge Function with retries and timeout
      console.log('Calling process-pdf function...');
      const maxRetries = 3;
      let attempt = 0;
      let processedData = null;
      let processError = null;

      while (attempt < maxRetries) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

          const response = await supabase.functions.invoke('process-pdf', {
            body: { fileUrl: publicUrl },
            signal: controller.signal,
          });
          
          clearTimeout(timeout);
          
          if (response.error) throw response.error;
          processedData = response.data;
          break;
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          processError = error;
          attempt++;
          if (attempt < maxRetries) {
            // Exponential backoff with jitter
            const backoff = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 10000);
            await new Promise(resolve => setTimeout(resolve, backoff));
          }
        }
      }

      if (processError && !processedData) {
        throw new Error(`Failed to process PDF after ${maxRetries} attempts: ${processError.message}`);
      }

      if (!processedData?.text) {
        throw new Error('No text extracted from PDF');
      }

      console.log('PDF processed successfully');
      onTextExtracted(processedData.text);

      toast({
        title: "Document Processed",
        description: "Your document has been uploaded and analyzed successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "There was an error processing your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF files only</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>
      {isUploading && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Processing document...</span>
        </div>
      )}
    </div>
  );
};