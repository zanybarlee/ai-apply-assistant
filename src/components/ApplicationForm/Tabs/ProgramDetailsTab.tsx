import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CourseSelection } from "../CourseSelection";
import { DocumentUpload } from "../DocumentUpload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProgramDetailsTabProps {
  formData: {
    selectedCourse?: string;
  };
  onChange: (field: string, value: string) => void;
}

interface TrainingProgram {
  id: string;
  provider_name: string;
  program_name: string;
  validity_start: string;
  validity_end: string;
  file_url: string | null;
}

export const ProgramDetailsTab = ({ formData, onChange }: ProgramDetailsTabProps) => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch training programs.",
        variant: "destructive",
      });
    }
  };

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

        // Refresh the programs list
        fetchPrograms();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-muted-foreground mb-2">Section 3. Programme Details</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Upload Training Program Certificate</h3>
          <DocumentUpload onTextExtracted={handleFileUpload} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Training Programs</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Validity Start</TableHead>
                <TableHead>Validity End</TableHead>
                <TableHead>File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>{program.provider_name}</TableCell>
                  <TableCell>{program.program_name}</TableCell>
                  <TableCell>{formatDate(program.validity_start)}</TableCell>
                  <TableCell>{formatDate(program.validity_end)}</TableCell>
                  <TableCell>
                    {program.file_url ? (
                      <a 
                        href={program.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </a>
                    ) : (
                      <span className="text-muted-foreground">No file</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {programs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No training programs uploaded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <CourseSelection 
          selectedCourse={formData.selectedCourse || ""} 
          onChange={(courseId) => onChange("selectedCourse", courseId)} 
        />
      </div>
    </div>
  );
};