export interface ValidationState {
  valid: boolean;
  message: string;
}

export interface FormValidationState {
  experience: ValidationState;
  tscs: ValidationState;
  timeline: ValidationState;
  industry: ValidationState;
}

export const validateTimelineRange = (timeline: string): boolean => {
  if (!timeline) return false;
  const completionDate = new Date(timeline);
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  const maxAllowedDate = new Date();
  maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() + 3);
  return completionDate >= fiveYearsAgo && completionDate <= maxAllowedDate;
};

export const calculateMinExperience = (timeline: string): number => {
  if (!timeline) return 0;
  const today = new Date();
  const completionDate = new Date(timeline);
  const yearsSinceCompletion = Math.floor(
    (today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
  );
  return Math.max(0, 3 - yearsSinceCompletion);
};

export const validateForm = (formData: {
  amount: string;
  timeline: string;
  tscsCovered?: number;
  industry?: string;
}): FormValidationState => {
  const experience = parseInt(formData.amount) || 0;
  const minExperience = calculateMinExperience(formData.timeline);

  return {
    experience: {
      valid: experience >= minExperience,
      message: `Minimum ${minExperience} years of experience required`,
    },
    tscs: {
      valid: (formData.tscsCovered || 0) >= 75,
      message: "Minimum 75% TSCs coverage required",
    },
    timeline: {
      valid: validateTimelineRange(formData.timeline),
      message: "Must be within 5 years past or 3 years future",
    },
    industry: {
      valid: !!formData.industry,
      message: "Industry selection required",
    },
  };
};