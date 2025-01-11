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
        className="bg-white border-secondary text-secondary hover:bg-secondary/10 transition-all duration-200"
      >
        Back
      </Button>
      <Button
        onClick={onNext}
        className="bg-[#C5D82D] hover:bg-[#D4E157] text-gray-900 transition-all duration-200"
      >
        {currentStep === STEPS.length - 1 ? "Submit" : "Next"}
      </Button>
    </div>
  );
};