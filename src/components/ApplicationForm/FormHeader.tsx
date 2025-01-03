interface FormHeaderProps {
  currentStep: number;
  firstName: string;
}

export const FormHeader = ({ currentStep, firstName }: FormHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-primary mb-2">IBF Certification Application</h1>
      <p className="text-gray-600">
        {currentStep > 0 && firstName 
          ? `Welcome back, ${firstName}! Continue your application.`
          : "Please complete the form below to apply for IBF certification"}
      </p>
    </div>
  );
};