import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ValidationAlert } from "./ValidationAlert";

interface IndustrySegmentSelectProps {
  value: string;
  onChange: (value: string) => void;
  validation: { valid: boolean; message: string };
}

export const IndustrySegmentSelect = ({ value, onChange, validation }: IndustrySegmentSelectProps) => (
  <div className="space-y-2">
    <Label htmlFor="industry">Industry Segment</Label>
    <Select onValueChange={onChange} value={value}>
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
    <ValidationAlert isValid={validation.valid} message={validation.message} />
  </div>
);