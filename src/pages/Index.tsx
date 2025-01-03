import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfo } from "@/components/ApplicationForm/PersonalInfo";
import { ApplicationDetails } from "@/components/ApplicationForm/ApplicationDetails";
import { CertificationLevel } from "@/components/ApplicationForm/CertificationLevel";
import { Review } from "@/components/ApplicationForm/Review";
import { AIAssistant } from "@/components/ApplicationForm/AIAssistant";
import { validatePersonalInfo, validateCertificationLevel, validateApplicationDetails } from "@/utils/certificationValidation";
import { savePreferences, getPreferences } from "@/utils/userPreferences";

const STEPS = ["Personal Info", "Certification Level", "Application Details", "Review"];

const Index = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    certificationLevel: "",
    yearsOfExperience: "",
    purpose: "",
    amount: "",
    timeline: "",
    industry: "",
    tscsCovered: 0,
  });

  // Load saved preferences on initial render
  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.lastVisitedStep !== undefined) {
      setCurrentStep(prefs.lastVisitedStep);
    }
    if (prefs.industry || prefs.certificationLevel) {
      setFormData(prev => ({
        ...prev,
        industry: prefs.industry || prev.industry,
        certificationLevel: prefs.certificationLevel || prev.certificationLevel,
      }));
    }
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Save relevant preferences when they change
      if (field === 'industry' || field === 'certificationLevel') {
        savePreferences({ [field]: value });
      }
      
      return newData;
    });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return validatePersonalInfo(formData);
      case 1:
        return validateCertificationLevel(formData);
      case 2:
        return validateApplicationDetails(formData);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

    if (currentStep < STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      savePreferences({ lastVisitedStep: nextStep });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      savePreferences({ lastVisitedStep: prevStep });
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Application Submitted",
      description: "We'll review your certification application and get back to you soon.",
    });
    // Clear preferences after successful submission
    savePreferences({ lastVisitedStep: 0 });
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      certificationLevel: "",
      yearsOfExperience: "",
      purpose: "",
      amount: "",
      timeline: "",
      industry: "",
      tscsCovered: 0,
    });
    setCurrentStep(0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo formData={formData} onChange={handleInputChange} />;
      case 1:
        return <CertificationLevel formData={formData} onChange={handleInputChange} />;
      case 2:
        return <ApplicationDetails formData={formData} onChange={handleInputChange} />;
      case 3:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">IBF Certification Application</h1>
          <p className="text-gray-600">
            {currentStep > 0 && formData.firstName 
              ? `Welcome back, ${formData.firstName}! Continue your application.`
              : "Please complete the form below to apply for IBF certification"}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${
                  index < STEPS.length - 1 ? "w-full" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                <div
                  className={`text-sm ${
                    index <= currentStep ? "text-primary" : "text-gray-500"
                  } hidden sm:block ml-3`}
                >
                  {step}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-grow mx-4 h-0.5 ${
                      index < currentStep ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

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
              className="bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              {currentStep === STEPS.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </Card>
      </div>
      
      <AIAssistant />
    </div>
  );
};

export default Index;