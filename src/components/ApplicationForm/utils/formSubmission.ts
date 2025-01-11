import { FormData } from "../types/formTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const submitForm = async (formData: FormData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const segmentExperience = formData.yearsOfExperience;
    if (isNaN(segmentExperience) || segmentExperience < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of years of experience",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('user_certifications')
      .insert([
        {
          user_id: user.id,
          job_role_id: formData.selectedRole,
          industry_segment: formData.industry,
          total_experience_years: segmentExperience,
          segment_experience_years: segmentExperience,
          status: 'submitted',
          application_type: 'certification',
        }
      ]);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Your certification application has been submitted successfully.",
    });

    return true;
  } catch (error) {
    console.error('Error submitting form:', error);
    toast({
      title: "Error",
      description: "Failed to submit certification application. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};