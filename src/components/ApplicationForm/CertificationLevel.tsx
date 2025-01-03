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
        <Label className="text-xl font-semibold text-primary">Select Certification Level</Label>
        <RadioGroup
          value={formData.certificationLevel}
          onValueChange={(value) => onChange("certificationLevel", value)}
          className="space-y-6"
        >
          <div className="relative flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors duration-200 cursor-pointer group">
            <RadioGroupItem value="qualified" id="qualified" className="mt-1" />
            <div className="space-y-2">
              <Label htmlFor="qualified" className="text-lg font-semibold text-primary group-hover:text-primary/90">
                IBF Qualified (Level 1)
                <span className="ml-2 inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Entry Level</span>
              </Label>
              <p className="text-sm text-gray-600 leading-relaxed">
                For new entrants equipped with foundational skills to undertake new roles. Requires successful completion of IBF-STS accredited course(s) and attainment of required skills for the selected industry segment and function. No minimum experience required.
              </p>
            </div>
          </div>

          <div className="relative flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors duration-200 cursor-pointer group">
            <RadioGroupItem value="advanced-2" id="advanced-2" className="mt-1" />
            <div className="space-y-2">
              <Label htmlFor="advanced-2" className="text-lg font-semibold text-primary group-hover:text-primary/90">
                IBF Advanced (Level 2)
                <span className="ml-2 inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Intermediate</span>
              </Label>
              <p className="text-sm text-gray-600 leading-relaxed">
                For practitioners who have demonstrated applied knowledge and advanced analytical skills for specialist or supervisory functions. Requires 3-7 years of relevant experience and successful completion of IBF-STS accredited course(s).
              </p>
            </div>
          </div>

          <div className="relative flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors duration-200 cursor-pointer group">
            <RadioGroupItem value="advanced-3" id="advanced-3" className="mt-1" />
            <div className="space-y-2">
              <Label htmlFor="advanced-3" className="text-lg font-semibold text-primary group-hover:text-primary/90">
                IBF Advanced (Level 3)
                <span className="ml-2 inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Senior Level</span>
              </Label>
              <p className="text-sm text-gray-600 leading-relaxed">
                For senior practitioners with 8+ years of relevant experience who have demonstrated advanced knowledge and analytical skills. Requires successful completion of IBF-STS accredited course(s) and proven expertise in the selected industry segment.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};