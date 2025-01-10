import { toast } from "@/hooks/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  certificationLevel: string;
  purpose: string;
  amount: string;
  timeline: string;
  industry?: string;
  tscsCovered?: number;
  selectedRole?: string;
}

export const validatePersonalInfo = (formData: FormData) => {
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
};

export const validateCertificationLevel = (formData: FormData) => {
  if (!formData.certificationLevel) {
    toast({
      title: "Missing Selection",
      description: "Please select a certification level.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

export const validateApplicationDetails = (formData: FormData) => {
  // Check for required fields
  if (!formData.selectedRole) {
    toast({
      title: "Missing Information",
      description: "Please select a job role.",
      variant: "destructive",
    });
    return false;
  }

  if (!formData.industry) {
    toast({
      title: "Missing Information",
      description: "Please select an industry segment.",
      variant: "destructive",
    });
    return false;
  }

  if (!formData.purpose) {
    toast({
      title: "Missing Information",
      description: "Please enter your current job role.",
      variant: "destructive",
    });
    return false;
  }

  if (!formData.amount) {
    toast({
      title: "Missing Information",
      description: "Please enter your years of experience.",
      variant: "destructive",
    });
    return false;
  }

  // Validate years of experience
  const yearsOfExperience = parseInt(formData.amount);
  if (isNaN(yearsOfExperience) || yearsOfExperience < 0) {
    toast({
      title: "Invalid Input",
      description: "Please enter a valid number of years for experience.",
      variant: "destructive",
    });
    return false;
  }

  // If all validations pass
  return true;
};