import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { PersonalInfo } from "@/components/ApplicationForm/PersonalInfo";
import { ApplicationDetails } from "@/components/ApplicationForm/ApplicationDetails";
import { CertificationLevel } from "@/components/ApplicationForm/CertificationLevel";
import { Review } from "@/components/ApplicationForm/Review";

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
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Personal Info
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          toast({
            title: "Missing Information",
            description: "Please fill in all personal information fields.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          toast({
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 1: // Certification Level
        if (!formData.certificationLevel) {
          toast({
            title: "Missing Selection",
            description: "Please select a certification level.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 2: // Application Details
        const yearsOfExperience = parseInt(formData.amount);
        
        if (!formData.purpose || !formData.amount || !formData.timeline) {
          toast({
            title: "Missing Information",
            description: "Please fill in all application details.",
            variant: "destructive",
          });
          return false;
        }

        // Certification level-specific experience validation
        if (formData.certificationLevel === "advanced-2" && yearsOfExperience < 3) {
          toast({
            title: "Experience Requirement",
            description: "IBF Advanced (Level 2) requires at least 3 years of experience.",
            variant: "destructive",
          });
          return false;
        }

        if (formData.certificationLevel === "advanced-3" && yearsOfExperience < 8) {
          toast({
            title: "Experience Requirement",
            description: "IBF Advanced (Level 3) requires at least 8 years of experience.",
            variant: "destructive",
          });
          return false;
        }

        // Validate completion date is in the future
        const completionDate = new Date(formData.timeline);
        if (completionDate <= new Date()) {
          toast({
            title: "Invalid Date",
            description: "Course completion date must be in the future.",
            variant: "destructive",
          });
          return false;
        }

        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

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
      description: "We'll review your certification application and get back to you soon.",
    });
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
            Please complete the form below to apply for IBF certification
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
    </div>
  );
};

export default Index;