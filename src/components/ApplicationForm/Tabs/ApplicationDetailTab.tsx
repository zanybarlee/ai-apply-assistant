import { JobRoleSelection } from "../JobRoleSelection";
import { IndustrySegmentSelect } from "../IndustrySegmentSelect";
import { ExperienceInput } from "../ExperienceInput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ApplicationDetailTabProps {
  formData: {
    purpose: string;
    amount: string;
    industry?: string;
    selectedRole?: string;
    timeline?: string;
  };
  onChange: (field: string, value: string | number) => void;
  validation: {
    experience: { valid: boolean; message: string };
    industry: { valid: boolean; message: string };
  };
}

export const ApplicationDetailTab = ({ formData, onChange, validation }: ApplicationDetailTabProps) => {
  const calculateMinExperience = () => {
    if (!formData.timeline) return 0;
    
    const today = new Date();
    const completionDate = new Date(formData.timeline);
    const yearsSinceCompletion = Math.floor(
      (today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    );
    return Math.max(0, 3 - yearsSinceCompletion);
  };

  const minExperience = calculateMinExperience();

  const showValidationAlert = !formData.selectedRole || !formData.industry || !formData.purpose || !formData.amount;

  return (
    <div className="space-y-6">
      {showValidationAlert && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fill in all required fields:
            {!formData.selectedRole && <span className="block">- Select a job role</span>}
            {!formData.industry && <span className="block">- Select an industry segment</span>}
            {!formData.purpose && <span className="block">- Enter your current job role</span>}
            {!formData.amount && <span className="block">- Enter your years of experience</span>}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-muted-foreground mb-2">Section 1. Applicant Details</h2>
        <p className="text-sm text-muted-foreground">
          Please ensure that your personal details are updated in "My Profile" page before proceeding with the application.
          If you wish to update your details, please click{" "}
          <a href="/profile" className="text-primary hover:underline">
            here
          </a>
          .
        </p>
      </div>

      <JobRoleSelection 
        selectedRole={formData.selectedRole || ""} 
        onChange={(roleId) => onChange("selectedRole", roleId)} 
      />

      <IndustrySegmentSelect
        value={formData.industry || ""}
        onChange={(value) => onChange("industry", value)}
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

      <ExperienceInput
        value={formData.amount}
        onChange={(value) => onChange("amount", value)}
        validation={validation.experience}
        minExperience={minExperience}
      />
    </div>
  );
};