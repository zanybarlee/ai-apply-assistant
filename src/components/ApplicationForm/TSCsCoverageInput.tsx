import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationAlert } from "./ValidationAlert";

interface TSCsCoverageInputProps {
  value: number;
  onChange: (value: number) => void;
  validation: { valid: boolean; message: string };
}

export const TSCsCoverageInput = ({ value, onChange, validation }: TSCsCoverageInputProps) => (
  <div className="space-y-2">
    <Label htmlFor="tscsCovered">TSCs Coverage (%)</Label>
    <Input
      id="tscsCovered"
      type="number"
      min="0"
      max="100"
      value={value || ""}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="transition-all duration-200 focus:ring-accent"
      placeholder="Enter percentage of TSCs covered"
    />
    <ValidationAlert isValid={validation.valid} message={validation.message} />
  </div>
);