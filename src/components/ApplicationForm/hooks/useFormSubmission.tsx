import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { savePreferences } from "@/utils/userPreferences";
import { FormData } from "./useFormState";

export const useFormSubmission = (
  formData: FormData,
  setFormData: (data: FormData) => void,
  setCurrentStep: (step: number) => void,
  setCurrentTabStep: (step: number) => void
) => {
  const { toast } = useToast();

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

      const segmentExperience = formData.yearsOfExperience;
      if (isNaN(segmentExperience) || segmentExperience < 0) {
        toast({
          title: "Error",
          description: "Please enter valid years of experience in your segment.",
          variant: "destructive",
        });
        return;
      }

      const { error: certError } = await supabase
        .from('user_certifications')
        .insert([
          {
            user_id: user.id,
            job_role_id: formData.selectedRole,
            industry_segment: formData.industry,
            total_experience_years: parseInt(formData.amount),
            segment_experience_years: segmentExperience,
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
      setCurrentStep(0);
      setCurrentTabStep(0);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
};