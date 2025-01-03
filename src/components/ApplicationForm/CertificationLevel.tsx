import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CertificationLevelProps {
  formData: {
    certificationLevel: string;
    yearsOfExperience: string;
  };
  onChange: (field: string, value: string) => void;
}

export const CertificationLevel = ({ formData, onChange }: CertificationLevelProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-4">
        <Label>Select Certification Level</Label>
        <RadioGroup
          value={formData.certificationLevel}
          onValueChange={(value) => onChange("certificationLevel", value)}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="qualified" id="qualified" />
            <div className="space-y-1">
              <Label htmlFor="qualified" className="font-medium">IBF Qualified (Level 1)</Label>
              <p className="text-sm text-gray-500">For new entrants equipped with foundational skills to undertake new roles. Requires successful completion of IBF-STS accredited course(s) and attainment of required skills for the selected industry segment and function. No minimum experience required.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="advanced-2" id="advanced-2" />
            <div className="space-y-1">
              <Label htmlFor="advanced-2" className="font-medium">IBF Advanced (Level 2)</Label>
              <p className="text-sm text-gray-500">For practitioners who have demonstrated applied knowledge and advanced analytical skills for specialist or supervisory functions. Requires 3-7 years of relevant experience and successful completion of IBF-STS accredited course(s).</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="advanced-3" id="advanced-3" />
            <div className="space-y-1">
              <Label htmlFor="advanced-3" className="font-medium">IBF Advanced (Level 3)</Label>
              <p className="text-sm text-gray-500">For senior practitioners with 8+ years of relevant experience who have demonstrated advanced knowledge and analytical skills. Requires successful completion of IBF-STS accredited course(s) and proven expertise in the selected industry segment.</p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};