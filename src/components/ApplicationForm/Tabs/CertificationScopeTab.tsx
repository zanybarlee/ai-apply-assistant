import { TSCsCoverageInput } from "../TSCsCoverageInput";

interface CertificationScopeTabProps {
  formData: {
    tscsCovered?: number;
  };
  onChange: (field: string, value: number) => void;
  validation: {
    tscs: { valid: boolean; message: string };
  };
}

export const CertificationScopeTab = ({ formData, onChange, validation }: CertificationScopeTabProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-muted-foreground mb-2">Section 4. Certification Scope</h2>
      </div>
      <TSCsCoverageInput
        value={formData.tscsCovered || 0}
        onChange={(value) => onChange("tscsCovered", value)}
        validation={validation.tscs}
      />
    </div>
  );
};