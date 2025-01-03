interface FormHeaderProps {
  currentStep: number;
  firstName: string;
}

export const FormHeader = ({ currentStep, firstName }: FormHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <img src="/lovable-uploads/16b8e354-0985-4c56-92d5-afff533ff465.png" alt="IBF Logo" className="h-16 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-white mb-2">IBF Certification Application</h1>
      <p className="text-gray-200">
        {currentStep > 0 && firstName 
          ? `Welcome back, ${firstName}! Continue your application.`
          : "Please complete the form below to apply for IBF certification"}
      </p>
    </div>
  );
};