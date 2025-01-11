import { FormHeader } from "./FormHeader";
import { FormNavigation } from "./FormNavigation";
import { ApplicationDetailTab } from "./Tabs/ApplicationDetailTab";
import { RegulatoryExamTab } from "./Tabs/RegulatoryExamTab";
import { ProgramDetailsTab } from "./Tabs/ProgramDetailsTab";
import { CertificationScopeTab } from "./Tabs/CertificationScopeTab";
import { Review } from "./Review";
import { useFormState } from "./hooks/useFormState";
import { submitForm } from "./utils/formSubmission";
import { STEPS } from "./constants";
import { useState } from "react";
import { validateForm } from "@/utils/validationUtils";

export const FormContainer = () => {
  const {
    formData,
    currentStep,
    setCurrentStep,
    handleInputChange,
    resetForm,
  } = useFormState();

  const [validation, setValidation] = useState(() => validateForm(formData));

  const handleSubmit = async () => {
    const success = await submitForm(formData);
    if (success) {
      resetForm();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ApplicationDetailTab
            formData={formData}
            onChange={handleInputChange}
            validation={validation}
          />
        );
      case 1:
        return <RegulatoryExamTab />;
      case 2:
        return (
          <ProgramDetailsTab
            formData={formData}
            onChange={handleInputChange}
          />
        );
      case 3:
        return (
          <CertificationScopeTab
            formData={formData}
            onChange={handleInputChange}
            validation={{
              tscs: {
                valid: formData.tscsCovered >= 75,
                message: formData.tscsCovered < 75 ? "TSCs coverage must be at least 75%" : "",
              }
            }}
          />
        );
      case 4:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <FormHeader 
        currentStep={currentStep} 
        firstName={formData.firstName} 
      />
      <div className="mt-8">{renderStep()}</div>
      <FormNavigation
        currentStep={currentStep}
        onNext={() => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))}
        onBack={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
      />
    </div>
  );
};