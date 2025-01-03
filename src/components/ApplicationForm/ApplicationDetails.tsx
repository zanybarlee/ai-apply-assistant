import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DocumentAnalyzer } from "./DocumentAnalyzer";

interface ApplicationDetailsProps {
  formData: {
    purpose: string;
    amount: string;
    timeline: string;
    industry?: string;
    tscsCovered?: number;
  };
  onChange: (field: string, value: string | number) => void;
}

export const ApplicationDetails = ({ formData, onChange }: ApplicationDetailsProps) => {
  const { toast } = useToast();

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

  return (
    <div className="space-y-6 animate-fadeIn">
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
        <p className="text-sm text-gray-500">Must cover at least 75% of TSCs for your role</p>
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
        {calculateMinExperience() > 0 && (
          <p className="text-sm text-amber-600">
            Minimum {calculateMinExperience()} years of experience required based on completion date
          </p>
        )}
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
        <p className="text-sm text-gray-500">Application must be made within 5 years of completion</p>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Document Analysis</h3>
        <DocumentAnalyzer />
      </div>
    </div>
  );
};
