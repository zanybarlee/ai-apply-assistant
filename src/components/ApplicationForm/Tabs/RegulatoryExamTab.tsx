import { RegulatoryExamForm } from "../RegulatoryExamForm";

export const RegulatoryExamTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-muted-foreground mb-2">Section 2. Industry / Regulatory Examination</h2>
      </div>
      <RegulatoryExamForm />
    </div>
  );
};