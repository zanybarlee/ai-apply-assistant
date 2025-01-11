import { useState } from "react";
import { FormData } from "../types";

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  certificationLevel: "",
  purpose: "",
  amount: "",
  timeline: "",
  industry: "",
  tscsCovered: 0,
  selectedRole: "",
  selectedCourse: "",
  selectedPrograms: [],
  yearsOfExperience: 0,
  name: "" // Initialize the name field
};

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
  };

  return {
    formData,
    currentStep,
    setCurrentStep,
    handleInputChange,
    resetForm,
  };
};