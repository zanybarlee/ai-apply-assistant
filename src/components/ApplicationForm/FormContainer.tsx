import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { PersonalInfo } from "./PersonalInfo";
import { CertificationLevel } from "./CertificationLevel";
import { ApplicationDetails } from "./ApplicationDetails";
import { Review } from "./Review";
import { FormNavigation } from "./FormNavigation";
import { FormHeader } from "./FormHeader";
import { validatePersonalInfo, validateCertificationLevel, validateApplicationDetails } from "@/utils/certificationValidation";
import { savePreferences, getPreferences } from "@/utils/userPreferences";

export const STEPS = ["Personal Info", "Certification Level", "Application Details", "Review"];

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  certificationLevel: string;
  yearsOfExperience: string;
  purpose: string;
  amount: string;
  timeline: string;
  industry: string;
  tscsCovered: number;
}

export const FormContainer = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
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

  const handleSubmit = () => {
    toast({
      title: "Application Submitted",
      description: "We'll review your certification application and get back to you soon.",
    });
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
    <div className="min-h-screen bg-gradient-to-br from-[#002B22] to-[#004D40] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <FormHeader currentStep={currentStep} firstName={formData.firstName} />
        <Card className="p-6 sm:p-8 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
          <div className="space-y-6">
            {renderStep()}
            <FormNavigation 
              currentStep={currentStep}
              onNext={() => {
                if (!validateStep()) return;
                if (currentStep < STEPS.length - 1) {
                  const nextStep = currentStep + 1;
                  setCurrentStep(nextStep);
                  savePreferences({ lastVisitedStep: nextStep });
                } else {
                  handleSubmit();
                }
              }}
              onBack={() => {
                if (currentStep > 0) {
                  const prevStep = currentStep - 1;
                  setCurrentStep(prevStep);
                  savePreferences({ lastVisitedStep: prevStep });
                }
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};