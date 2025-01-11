import { DocumentUpload } from "../DocumentUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadSectionProps {
  onUploadSuccess: () => void;
}

export const DocumentUploadSection = ({ onUploadSuccess }: DocumentUploadSectionProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch('http://cens.synology.me:9002/upload_training_certificate', {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      console.log('Upload response:', data);

      if (data.status === "processed successfully") {
        const { training_metadata } = data;
        
        const { error } = await supabase
          .from('training_programs')
          .insert([{
            provider_name: training_metadata.provider_name,
            program_name: training_metadata.program_name,
            validity_start: training_metadata.validity_start,
            validity_end: training_metadata.validity_end,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Training program certificate uploaded successfully.",
        });

        onUploadSuccess();
        return data.filename;
      }

      return null;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process training program certificate.",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Upload Training Program Certificate</h3>
      <DocumentUpload onTextExtracted={handleFileUpload} />
    </div>
  );
};