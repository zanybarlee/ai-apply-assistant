import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalysisResultsProps {
  analysis: {
    label: string;
    score: number;
  }[];
}

export const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  if (analysis.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
      <div className="space-y-4">
        {analysis.map(({ label, score }) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{label}</span>
              <span className="text-sm text-gray-500">{Math.round(score * 100)}%</span>
            </div>
            <Progress value={score * 100} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
};