import { useState, useEffect } from "react";
import { FormData } from "../types/formTypes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const initialFormData: FormData = {
  name: "",
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
};

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: `${profile.first_name} ${profile.last_name}`.trim(),
            email: user.email || "",
            phone: profile.phone_number || "",
          }));
        }
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === 'industry' || field === 'certificationLevel') {
        newData.selectedRole = '';
      }
      return newData;
    });
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