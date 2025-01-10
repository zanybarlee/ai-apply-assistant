import { CourseSelection } from "../CourseSelection";

interface ProgramDetailsTabProps {
  formData: {
    selectedCourse?: string;
  };
  onChange: (field: string, value: string) => void;
}

export const ProgramDetailsTab = ({ formData, onChange }: ProgramDetailsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-muted-foreground mb-2">Section 3. Programme Details</h2>
      </div>
      <CourseSelection 
        selectedCourse={formData.selectedCourse || ""} 
        onChange={(courseId) => onChange("selectedCourse", courseId)} 
      />
    </div>
  );
};