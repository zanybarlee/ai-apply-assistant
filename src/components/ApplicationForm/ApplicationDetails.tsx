import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, BookOpen, Award } from "lucide-react";
import { ApplicationDetailTab } from "./Tabs/ApplicationDetailTab";
import { RegulatoryExamTab } from "./Tabs/RegulatoryExamTab";
import { ProgramDetailsTab } from "./Tabs/ProgramDetailsTab";
import { CertificationScopeTab } from "./Tabs/CertificationScopeTab";
import { FormValidationState, validateForm } from "@/utils/validationUtils";

interface ApplicationDetailsProps {
  formData: {
    purpose: string;
    amount: string;
    timeline: string;
    industry?: string;
    tscsCovered?: number;
    selectedRole?: string;
    selectedCourse?: string;
    selectedPrograms?: string[];
    certificationLevel?: string;
    yearsOfExperience?: number;
  };
  onChange: (field: string, value: string | number | string[]) => void;
}

export const ApplicationDetails = ({ formData, onChange }: ApplicationDetailsProps) => {
  const [validation, setValidation] = useState<FormValidationState>({
    experience: { valid: true, message: "" },
    tscs: { valid: false, message: "Minimum 75% TSCs coverage required" },
    timeline: { valid: false, message: "Must be within valid date range" },
    industry: { valid: false, message: "Industry selection required" },
  });

  useEffect(() => {
    setValidation(validateForm(formData));
  }, [formData]);

  return (
    <Tabs defaultValue="application-details" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="application-details" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Application Details</span>
        </TabsTrigger>
        <TabsTrigger value="regulatory-exam" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Regulatory Exam</span>
        </TabsTrigger>
        <TabsTrigger value="program-details" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Program Details</span>
        </TabsTrigger>
        <TabsTrigger value="certification-scope" className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          <span className="hidden sm:inline">Certification Scope</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="application-details">
          <ApplicationDetailTab 
            formData={formData}
            onChange={onChange}
            validation={{
              experience: validation.experience,
              industry: validation.industry
            }}
          />
        </TabsContent>

        <TabsContent value="regulatory-exam">
          <RegulatoryExamTab />
        </TabsContent>

        <TabsContent value="program-details">
          <ProgramDetailsTab 
            formData={formData}
            onChange={onChange}
          />
        </TabsContent>

        <TabsContent value="certification-scope">
          <CertificationScopeTab 
            formData={formData}
            onChange={onChange}
            validation={{
              tscs: validation.tscs
            }}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};