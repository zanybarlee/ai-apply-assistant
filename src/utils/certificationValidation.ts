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
  const yearsOfExperience = parseInt(formData.amount);
  const completionDate = new Date(formData.timeline);
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  
  if (!formData.purpose || !formData.amount || !formData.timeline || !formData.industry) {
    toast({
      title: "Missing Information",
      description: "Please fill in all application details.",
      variant: "destructive",
    });
    return false;
  }

  // TSCs coverage validation
  const tscsCovered = formData.tscsCovered || 0;
  if (tscsCovered < 75) {
    toast({
      title: "Insufficient TSCs Coverage",
      description: "You must complete IBF-STS accredited courses covering at least 75% of the TSCs for your role.",
      variant: "destructive",
    });
    return false;
  }

  // 5-year application window validation
  if (completionDate < fiveYearsAgo) {
    toast({
      title: "Application Window Expired",
      description: "Application must be made within 5 years from the completion of the IBF-STS accredited programme.",
      variant: "destructive",
    });
    return false;
  }

  // Experience requirements validation
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

  return true;
};