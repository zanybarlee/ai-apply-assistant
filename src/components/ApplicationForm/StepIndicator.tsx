import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                index < currentStep
                  ? "bg-accent text-white"
                  : index === currentStep
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-[2px] w-24 mx-2 transition-all duration-200",
                  index < currentStep
                    ? "bg-accent"
                    : index === currentStep
                    ? "bg-primary"
                    : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <span
            key={`label-${step}`}
            className={cn(
              "text-sm transition-all duration-200",
              index <= currentStep ? "text-primary" : "text-gray-400"
            )}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};