import { useState, useEffect } from "react";
import { savePreferences, getPreferences } from "@/utils/userPreferences";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  certificationLevel: string;
  yearsOfExperience: number;
  purpose: string;
  amount: string;
  timeline: string;
  industry: string;
  tscsCovered: number;
  selectedRole?: string;
  selectedCourse?: string;
  selectedPrograms?: string[];
}

export const useFormState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTabStep, setCurrentTabStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    certificationLevel: "",
    yearsOfExperience: 0,
    purpose: "",
    amount: "",
    timeline: "",
    industry: "",
    tscsCovered: 0,
    selectedRole: "",
    selectedCourse: "",
    selectedPrograms: [],
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

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === 'industry' || field === 'certificationLevel') {
        savePreferences({ [field]: value });
      }
      return newData;
    });
  };

  return {
    currentStep,
    setCurrentStep,
    currentTabStep,
    setCurrentTabStep,
    formData,
    setFormData,
    handleInputChange
  };
};