import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DocumentAnalysis } from "./DocumentAnalysis";
import { JobRoleSelection } from "./JobRoleSelection";
import { CourseSelection } from "./CourseSelection";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const calculateMinExperience = () => {
    const today = new Date();
    const completionDate = new Date(formData.timeline);
    const yearsSinceCompletion = Math.floor(
      (today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    );
    return Math.max(0, 3 - yearsSinceCompletion);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    const maxAllowedDate = new Date();
    maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() + 3);

    if (selectedDate > maxAllowedDate) {
      toast({
        title: "Invalid Date",
        description: "Completion date cannot be more than 3 years in the future.",
        variant: "destructive",
      });
      return;
    }

    if (selectedDate < fiveYearsAgo) {
      toast({
        title: "Date Out of Range",
        description: "Application must be made within 5 years of completion.",
        variant: "destructive",
      });
      return;
    }

    onChange("timeline", e.target.value);
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const renderValidationStatus = (field: keyof ValidationState) => {
    const status = validation[field];
    return (
      <Alert variant={status.valid ? "default" : "destructive"} className="mt-2">
        <div className="flex items-center gap-2">
          {status.valid ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{status.message}</AlertDescription>
        </div>
      </Alert>
    );
  };

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

      <div className="space-y-2">
        <Label htmlFor="industry">Industry Segment</Label>
        <Select onValueChange={handleIndustryChange} value={formData.industry}>
          <SelectTrigger>
            <SelectValue placeholder="Select your industry segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="banking">Banking</SelectItem>
            <SelectItem value="capital-markets">Capital Markets</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="asset-management">Asset Management</SelectItem>
          </SelectContent>
        </Select>
        {renderValidationStatus("industry")}
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="tscsCovered">TSCs Coverage (%)</Label>
        <Input
          id="tscsCovered"
          type="number"
          min="0"
          max="100"
          value={formData.tscsCovered || ""}
          onChange={(e) => onChange("tscsCovered", parseInt(e.target.value))}
          className="transition-all duration-200 focus:ring-accent"
          placeholder="Enter percentage of TSCs covered"
        />
        {renderValidationStatus("tscs")}
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          type="number"
          value={formData.amount}
          onChange={(e) => onChange("amount", e.target.value)}
          className="transition-all duration-200 focus:ring-accent"
          placeholder="Enter years of experience"
          min={calculateMinExperience()}
        />
        {renderValidationStatus("experience")}
      </div>

      <div className="space-y-2">
        <Label htmlFor="completionDate">Course Completion Date</Label>
        <Input
          id="completionDate"
          type="date"
          value={formData.timeline}
          onChange={handleDateChange}
          className="transition-all duration-200 focus:ring-accent"
          max={maxDateString}
          placeholder="dd/mm/yyyy"
        />
        {renderValidationStatus("timeline")}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Document Analysis</h3>
        <DocumentAnalysis />
      </div>
    </div>
  );
};