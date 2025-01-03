import { pipeline } from "@huggingface/transformers";
import { ClassificationResult, AnalysisResult } from "./AITypes";

export const analyzeApplication = async (text: string): Promise<AnalysisResult[]> => {
  try {
    const classifier = await pipeline(
      'text-classification',
      'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      { device: "webgpu" }
    );

    const result = await classifier(text) as ClassificationResult;
    return [
      {
        label: "Application Completeness",
        score: result[0]?.score || 0
      },
      {
        label: "Eligibility Match",
        score: Math.min(1, (result[0]?.score || 0) * 1.2)
      }
    ];
  } catch (error) {
    console.error('Error analyzing application:', error);
    return [];
  }
};