import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentAnalysis } from "./DocumentAnalysis";
import { JobRoleSelection } from "./JobRoleSelection";
import { CourseSelection } from "./CourseSelection";
import { IndustrySegmentSelect } from "./IndustrySegmentSelect";
import { TSCsCoverageInput } from "./TSCsCoverageInput";
import { ExperienceInput } from "./ExperienceInput";
import { CompletionDateInput } from "./CompletionDateInput";
import { useEffect, useState } from "react";

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

  const handleIndustryChange = (value: string) => {
    onChange("industry", value);
    const suggestedTSCs = {
      banking: 85,
      "capital-markets": 80,
      insurance: 75,
      "asset-management": 78,
    }[value];

    if (suggestedTSCs) {
      onChange("tscsCovered", suggestedTSCs);
      toast({
        title: "TSCs Coverage Updated",
        description: `Suggested coverage for ${value} industry has been applied.`,
      });
    }
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      <JobRoleSelection 
        selectedRole={formData.selectedRole || ""} 
        onChange={(roleId) => onChange("selectedRole", roleId)} 
      />

      <CourseSelection 
        selectedCourse={formData.selectedCourse || ""} 
        onChange={(courseId) => onChange("selectedCourse", courseId)} 
      />

      <IndustrySegmentSelect
        value={formData.industry || ""}
        onChange={handleIndustryChange}
        validation={validation.industry}
      />

      <div className="space-y-2">
        <Label htmlFor="jobRole">Current Job Role</Label>
        <Input
          id="jobRole"
          type="text"
          value={formData.purpose}
          onChange={(e) => onChange("purpose", e.target.value)}
          className="transition-all duration-200 focus:ring-accent"
          placeholder="Enter your current job role"
        />
      </div>

      <TSCsCoverageInput
        value={formData.tscsCovered || 0}
        onChange={(value) => onChange("tscsCovered", value)}
        validation={validation.tscs}
      />

      <ExperienceInput
        value={formData.amount}
        onChange={(value) => onChange("amount", value)}
        minExperience={calculateMinExperience()}
        validation={validation.experience}
      />

      <CompletionDateInput
        value={formData.timeline}
        onChange={(value) => onChange("timeline", value)}
        maxDate={maxDateString}
        validation={validation.timeline}
      />

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Document Analysis</h3>
        <DocumentAnalysis />
      </div>
    </div>
  );
};