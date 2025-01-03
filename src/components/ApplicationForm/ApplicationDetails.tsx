import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
        <Label htmlFor="purpose">Purpose of Application</Label>
        <Textarea
          id="purpose"
          value={formData.purpose}
          onChange={(e) => onChange("purpose", e.target.value)}
          className="min-h-[120px] transition-all duration-200 focus:ring-accent"
          placeholder="Please describe the purpose of your application..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Requested Amount</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => onChange("amount", e.target.value)}
          className="transition-all duration-200 focus:ring-accent"
          placeholder="Enter amount in USD"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="timeline">Expected Timeline</Label>
        <Input
          id="timeline"
          type="text"
          value={formData.timeline}
          onChange={(e) => onChange("timeline", e.target.value)}
          className="transition-all duration-200 focus:ring-accent"
          placeholder="e.g., 6 months"
        />
      </div>
    </div>
  );
};