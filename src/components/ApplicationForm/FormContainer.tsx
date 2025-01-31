import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { PersonalInfo } from "./PersonalInfo";
import { ApplicationDetails } from "./ApplicationDetails";
import { Review } from "./Review";
import { FormNavigation } from "./FormNavigation";
import { FormHeader } from "./FormHeader";
import { validatePersonalInfo, validateApplicationDetails } from "@/utils/certificationValidation";
import { useFormState } from "./hooks/useFormState";
import { useFormSubmission } from "./hooks/useFormSubmission";
import { AIAssistant } from "./AIAssistant";

export const STEPS = [
  "Personal Info",
  "Application Details",
  "Review & Submit"
];

export const FormContainer = () => {
  const {
    currentStep,
    setCurrentStep,
    currentTabStep,
    setCurrentTabStep,
    formData,
    setFormData,
    handleInputChange
  } = useFormState();

  const { handleSubmit } = useFormSubmission(
    formData,
    setFormData,
    setCurrentStep,
    setCurrentTabStep
  );

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return validatePersonalInfo(formData);
      case 1:
        return validateApplicationDetails(formData);
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo formData={formData} onChange={handleInputChange} />;
      case 1:
        return (
          <ApplicationDetails 
            formData={formData} 
            onChange={handleInputChange}
            currentStep={currentTabStep}
            onStepChange={setCurrentTabStep}
            onMainStepChange={(direction) => {
              if (direction === 'back') {
                setCurrentStep(0);
              } else if (direction === 'next') {
                setCurrentStep(2);
              }
            }}
          />
        );
      case 2:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FBF2] to-[#F0F6F3]">
      <nav className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-secondary/20">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link to="/" className="text-2xl font-bold text-secondary hover:text-primary transition-colors">
            IBF
          </Link>
        </div>
      </nav>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FormHeader currentStep={currentStep} firstName={formData.firstName} />
          <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm border border-secondary/20 shadow-lg">
            <div className="space-y-6">
              {renderStep()}
              {currentStep !== 1 && (
                <FormNavigation 
                  currentStep={currentStep}
                  onNext={() => {
                    if (!validateStep()) return;
                    if (currentStep < STEPS.length - 1) {
                      const nextStep = currentStep + 1;
                      setCurrentStep(nextStep);
                    } else {
                      handleSubmit();
                    }
                  }}
                  onBack={() => {
                    if (currentStep > 0) {
                      const prevStep = currentStep - 1;
                      setCurrentStep(prevStep);
                    }
                  }}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
      <AIAssistant />
    </div>
  );
};