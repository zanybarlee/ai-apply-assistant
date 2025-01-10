import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationAlert } from "./ValidationAlert";

interface ExperienceInputProps {
  value: string;
  onChange: (value: string) => void;
  minExperience: number;
  validation: { valid: boolean; message: string };
}

export const ExperienceInput = ({ value, onChange, minExperience, validation }: ExperienceInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="experience">Years of Experience</Label>
      <Input
        id="experience"
        type="number"
        value={value}
        onChange={handleChange}
        className="transition-all duration-200 focus:ring-accent"
        placeholder="Enter years of experience"
        min={minExperience}
      />
      <ValidationAlert 
        isValid={validation.valid} 
        message={validation.valid ? "" : `Minimum ${minExperience} years of experience required`} 
      />
    </div>
  );
};