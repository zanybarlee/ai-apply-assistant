export interface FormData {
  name: string;
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

export interface FormValidation {
  tscs: {
    valid: boolean;
    message: string;
  };
}