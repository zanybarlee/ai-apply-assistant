import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationAlert } from "./ValidationAlert";

interface ExperienceInputProps {
  value: string;
  onChange: (value: string) => void;
  minExperience: number;
  validation: { valid: boolean; message: string };
}

export const ExperienceInput = ({ value, onChange, minExperience, validation }: ExperienceInputProps) => (
  <div className="space-y-2">
    <Label htmlFor="experience">Years of Experience</Label>
    <Input
      id="experience"
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="transition-all duration-200 focus:ring-accent"
      placeholder="Enter years of experience"
      min={minExperience}
    />
    <ValidationAlert isValid={validation.valid} message={validation.message} />
  </div>
);