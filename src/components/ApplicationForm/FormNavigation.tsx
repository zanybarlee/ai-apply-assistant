import { Button } from "@/components/ui/button";
import { STEPS } from "./FormContainer";

interface FormNavigationProps {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
}

export const FormNavigation = ({ currentStep, onNext, onBack }: FormNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 0}
        className="transition-all duration-200 hover:bg-gray-100"
      >
        Back
      </Button>
      <Button
        onClick={onNext}
        className="bg-primary hover:bg-primary/90 transition-all duration-200"
      >
        {currentStep === STEPS.length - 1 ? "Submit" : "Next"}
      </Button>
    </div>
  );
};