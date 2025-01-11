import { STEPS } from "./constants";
import { StepIndicator } from "./StepIndicator";
import { FormHeaderProps } from "./types";

export const FormHeader = ({ currentStep, firstName }: FormHeaderProps) => {
  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Personal Information";
      case 1:
        return "Application Details";
      case 2:
        return "Review & Submit";
      default:
        return "";
    }
  };

  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        IBF Certification Application
      </h1>
      {firstName && (
        <p className="text-lg text-gray-600 mb-6">
          Welcome back, {firstName}
        </p>
      )}
      <StepIndicator currentStep={currentStep} steps={STEPS} />
      <h2 className="text-xl font-semibold text-gray-800 mt-6">
        {getStepTitle()}
      </h2>
    </div>
  );
};