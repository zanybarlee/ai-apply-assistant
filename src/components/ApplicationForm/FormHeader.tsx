import { FormHeaderProps } from "./types";

export const FormHeader = ({ currentStep, firstName }: FormHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <img src="/lovable-uploads/738698ea-454f-46d4-9d26-578175ae9f45.png" alt="IBF Logo" className="h-16 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-secondary mb-2">IBF Certification Application</h1>
      <p className="text-secondary/80">
        {currentStep > 0 && firstName 
          ? `Welcome back, ${firstName}! Continue your application.`
          : "Please complete the form below to apply for IBF certification"}
      </p>
    </div>
  );
};