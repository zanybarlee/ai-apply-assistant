import { useState, useEffect } from "react";
import { CourseSelection } from "../CourseSelection";
import { DocumentUploadSection } from "../TrainingProgram/DocumentUploadSection";
import { ProgramsTable } from "../TrainingProgram/ProgramsTable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-muted-foreground mb-2">Section 3. Programme Details</h2>
      </div>

      <div className="space-y-6">
        <DocumentUploadSection onUploadSuccess={fetchPrograms} />
        <ProgramsTable programs={programs} />
        <CourseSelection 
          selectedCourse={formData.selectedCourse || ""} 
          onChange={(courseId) => onChange("selectedCourse", courseId)} 
        />
      </div>
    </div>
  );
};