import { TSCsCoverageInput } from "../TSCsCoverageInput";
import { IBFProgramsTable } from "../IBFPrograms/IBFProgramsTable";
import { useState } from "react";

interface CertificationScopeTabProps {
  formData: {
    tscsCovered?: number;
    certificationLevel?: string;
    yearsOfExperience?: number;
    selectedPrograms?: string[];
  };
  onChange: (field: string, value: number | string[]) => void;
  validation: {
    tscs: { valid: boolean; message: string };
  };
}

export const CertificationScopeTab = ({ formData, onChange, validation }: CertificationScopeTabProps) => {
  const handleProgramSelect = (programId: string, isSelected: boolean) => {
    const currentPrograms = formData.selectedPrograms || [];
    let newPrograms: string[];
    
    if (isSelected) {
      newPrograms = [...currentPrograms, programId];
    } else {
      newPrograms = currentPrograms.filter(id => id !== programId);
    }
    
    onChange("selectedPrograms", newPrograms);
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-muted-foreground mb-2">Section 4. Certification Scope</h2>
      </div>
      
      <TSCsCoverageInput
        value={formData.tscsCovered || 0}
        onChange={(value) => onChange("tscsCovered", value)}
        validation={validation.tscs}
      />

      <div className="mt-8">
        <IBFProgramsTable 
          userCertificationLevel={formData.certificationLevel}
          yearsOfExperience={formData.yearsOfExperience}
          selectedPrograms={formData.selectedPrograms || []}
          onProgramSelect={handleProgramSelect}
        />
      </div>
    </div>
  );
};