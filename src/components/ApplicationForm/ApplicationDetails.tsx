import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, BookOpen, Award } from "lucide-react";
import { ApplicationDetailTab } from "./Tabs/ApplicationDetailTab";
import { RegulatoryExamTab } from "./Tabs/RegulatoryExamTab";
import { ProgramDetailsTab } from "./Tabs/ProgramDetailsTab";
import { CertificationScopeTab } from "./Tabs/CertificationScopeTab";

interface ApplicationDetailsProps {
  formData: {
    purpose: string;
    amount: string;
    timeline: string;
    industry?: string;
    tscsCovered?: number;
    selectedRole?: string;
    selectedCourse?: string;
  };
  onChange: (field: string, value: string | number) => void;
}

interface ValidationState {
  experience: { valid: boolean; message: string };
  tscs: { valid: boolean; message: string };
  timeline: { valid: boolean; message: string };
  industry: { valid: boolean; message: string };
}

export const ApplicationDetails = ({ formData, onChange }: ApplicationDetailsProps) => {
  const { toast } = useToast();
  const [validation, setValidation] = useState<ValidationState>({
    experience: { valid: false, message: "Minimum experience required" },
    tscs: { valid: false, message: "Minimum 75% TSCs coverage required" },
    timeline: { valid: false, message: "Must be within valid date range" },
    industry: { valid: false, message: "Industry selection required" },
  });

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const today = new Date();
    const completionDate = new Date(formData.timeline);
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    const maxAllowedDate = new Date();
    maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() + 3);

    const experience = parseInt(formData.amount) || 0;
    const minExperience = calculateMinExperience();

    setValidation({
      experience: {
        valid: experience >= minExperience,
        message: `Minimum ${minExperience} years of experience required`,
      },
      tscs: {
        valid: (formData.tscsCovered || 0) >= 75,
        message: "Minimum 75% TSCs coverage required",
      },
      timeline: {
        valid: completionDate >= fiveYearsAgo && completionDate <= maxAllowedDate,
        message: "Must be within 5 years past or 3 years future",
      },
      industry: {
        valid: !!formData.industry,
        message: "Industry selection required",
      },
    });
  };

  const calculateMinExperience = () => {
    const today = new Date();
    const completionDate = new Date(formData.timeline);
    const yearsSinceCompletion = Math.floor(
      (today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    );
    return Math.max(0, 3 - yearsSinceCompletion);
  };

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
