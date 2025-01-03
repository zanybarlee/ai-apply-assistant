import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

  // Suggest TSCs coverage based on industry
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

  // Calculate minimum years of experience based on certification level
  const calculateMinExperience = () => {
    const today = new Date();
    const completionDate = new Date(formData.timeline);
    const yearsSinceCompletion = Math.floor(
      (today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    );
    return Math.max(0, 3 - yearsSinceCompletion);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    if (date > new Date()) {
      toast({
        title: "Invalid Date",
        description: "Completion date cannot be in the future.",
        variant: "destructive",
      });
      return;
    }

    if (date < fiveYearsAgo) {
      toast({
        title: "Date Out of Range",
        description: "Application must be made within 5 years of completion.",
        variant: "destructive",
      });
      return;
    }

    onChange("timeline", e.target.value);
  };

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
          max={new Date().toISOString().split("T")[0]}
          placeholder="dd/mm/yyyy"
        />
        <p className="text-sm text-gray-500">Application must be made within 5 years of completion</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          className="min-h-[120px] transition-all duration-200 focus:ring-accent"
          placeholder="Please provide any additional information relevant to your application..."
        />
      </div>
    </div>
  );
};