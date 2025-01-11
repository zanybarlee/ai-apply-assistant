import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

interface DocumentUploadProps {
  onTextExtracted: (file: File) => Promise<string | null>;
}

export const DocumentUpload = ({ onTextExtracted }: DocumentUploadProps) => {
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
      await onTextExtracted(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "There was an error uploading your document. Please try again.",
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
          <span>Uploading document...</span>
        </div>
      )}
    </div>
  );
};