import { Card } from "@/components/ui/card";

interface AnalysisResultsProps {
  analysis: { label: string; score: number }[];
}

export const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  if (analysis.length === 0) return null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Analysis Results</h3>
      <div className="space-y-2">
        {analysis.map((result, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{result.label}</span>
            <span className="text-sm font-mono">
              {(result.score * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};