import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { StepIndicator } from "@/components/ApplicationForm/StepIndicator";
import { PersonalInfo } from "@/components/ApplicationForm/PersonalInfo";
import { ApplicationDetails } from "@/components/ApplicationForm/ApplicationDetails";
import { Review } from "@/components/ApplicationForm/Review";

const STEPS = ["Personal Info", "Application Details", "Review"];

const Index = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    purpose: "",
    amount: "",
    timeline: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Application Submitted",
      description: "We'll review your application and get back to you soon.",
    });
    // Reset form after submission
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      purpose: "",
      amount: "",
      timeline: "",
    });
    setCurrentStep(0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfo
            formData={formData}
            onChange={handleInputChange}
          />
        );
      case 1:
        return (
          <ApplicationDetails
            formData={formData}
            onChange={handleInputChange}
          />
        );
      case 2:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">Application Form</h1>
          <p className="text-gray-600">
            Please fill out the form below to submit your application
          </p>
        </div>

        <StepIndicator currentStep={currentStep} steps={STEPS} />

        <Card className="p-6 sm:p-8 bg-white shadow-sm">
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="transition-all duration-200 hover:bg-gray-100"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-accent hover:bg-accent/90 transition-all duration-200"
            >
              {currentStep === STEPS.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;