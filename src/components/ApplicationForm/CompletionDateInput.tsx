import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationAlert } from "./ValidationAlert";

interface CompletionDateInputProps {
  value: string;
  onChange: (value: string) => void;
  maxDate: string;
  validation: { valid: boolean; message: string };
}

export const CompletionDateInput = ({ value, onChange, maxDate, validation }: CompletionDateInputProps) => (
  <div className="space-y-2">
    <Label htmlFor="completionDate">Course Completion Date</Label>
    <Input
      id="completionDate"
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="transition-all duration-200 focus:ring-accent"
      max={maxDate}
      placeholder="dd/mm/yyyy"
    />
    <ValidationAlert isValid={validation.valid} message={validation.message} />
  </div>
);