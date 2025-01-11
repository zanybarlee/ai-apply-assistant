export interface FormHeaderProps {
  currentStep: number;
  firstName: string;
}

export interface FormData {
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
  selectedCourse?: string;
  selectedPrograms?: string[];
  yearsOfExperience?: number;
}

export interface FormValidation {
  tscs: {
    valid: boolean;
    message: string;
  };
}