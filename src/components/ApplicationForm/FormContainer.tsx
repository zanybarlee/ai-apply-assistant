import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PersonalInfo } from "./PersonalInfo";
import { CertificationLevel } from "./CertificationLevel";
import { ApplicationDetails } from "./ApplicationDetails";
import { Review } from "./Review";
import { FormNavigation } from "./FormNavigation";
import { FormHeader } from "./FormHeader";
import { validatePersonalInfo, validateCertificationLevel, validateApplicationDetails } from "@/utils/certificationValidation";
import { savePreferences, getPreferences } from "@/utils/userPreferences";
import { supabase } from "@/integrations/supabase/client";

export const STEPS = [
  "Personal Info",
  "Application Details",
  "Review & Submit"
];

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
  selectedRole?: string;
  selectedCourse?: string;
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
    selectedRole: "",
    selectedCourse: "",
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
        return validateApplicationDetails(formData);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!formData.selectedRole) {
        toast({
          title: "Error",
          description: "Please select a job role before submitting.",
          variant: "destructive",
        });
        return;
      }

      // Save certification application
      const { error: certError } = await supabase
        .from('user_certifications')
        .insert([
          {
            user_id: user.id,
            job_role_id: formData.selectedRole, // This should be a valid UUID from the job_roles table
            industry_segment: formData.industry,
            total_experience_years: parseInt(formData.amount),
            segment_experience_years: parseInt(formData.yearsOfExperience),
            status: 'submitted'
          }
        ]);

      if (certError) {
        console.error('Certification submission error:', certError);
        throw certError;
      }

      toast({
        title: "Application Submitted",
        description: "Your certification application has been submitted successfully.",
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
        selectedRole: "",
        selectedCourse: "",
      });
      setCurrentStep(0);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo formData={formData} onChange={handleInputChange} />;
      case 1:
        return <ApplicationDetails formData={formData} onChange={handleInputChange} />;
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
    </div>
  );
};