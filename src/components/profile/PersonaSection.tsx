import { ReactNode } from "react";

interface PersonaSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export const PersonaSection = ({ title, children, icon }: PersonaSectionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};