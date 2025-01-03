import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApplicationDetailsProps {
  formData: {
    purpose: string;
    amount: string;
    timeline: string;
  };
  onChange: (field: string, value: string) => void;
}

export const ApplicationDetails = ({ formData, onChange }: ApplicationDetailsProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <Label htmlFor="industry">Industry Segment</Label>
        <Select onValueChange={(value) => onChange("industry", value)}>
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
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          type="number"
          value={formData.amount}
          onChange={(e) => onChange("amount", e.target.value)}
          className="transition-all duration-200 focus:ring-accent"
          placeholder="Enter years of experience"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="completionDate">Course Completion Date</Label>
        <Input
          id="completionDate"
          type="date"
          value={formData.timeline}
          onChange={(e) => onChange("timeline", e.target.value)}
          className="transition-all duration-200 focus:ring-accent"
        />
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