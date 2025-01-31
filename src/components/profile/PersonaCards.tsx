import { Card } from "@/components/ui/card";
import { PersonaSection } from "./PersonaSection";
import { FileText, Target, ThumbsUp, ClipboardList } from "lucide-react";

interface PersonaCardsProps {
  firstName: string;
}

export const PersonaCards = ({ firstName }: PersonaCardsProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <PersonaSection title="Bio" icon={<FileText className="w-5 h-5 text-primary" />}>
          <p>Finance professional with experience in {firstName}'s field, focused on continuous learning and professional development.</p>
        </PersonaSection>
      </Card>

      <Card className="p-6">
        <PersonaSection title="Goals" icon={<Target className="w-5 h-5 text-primary" />}>
          <ul className="list-disc list-inside space-y-2">
            <li>Network and connect with industry peers</li>
            <li>Enhance professional qualifications</li>
            <li>Stay updated with industry trends</li>
          </ul>
        </PersonaSection>
      </Card>

      <Card className="p-6">
        <PersonaSection title="Motivations" icon={<ThumbsUp className="w-5 h-5 text-primary" />}>
          <p>Committed to professional growth and development in the financial sector, seeking opportunities to expand knowledge and expertise.</p>
        </PersonaSection>
      </Card>

      <Card className="p-6">
        <PersonaSection title="Expectations" icon={<ClipboardList className="w-5 h-5 text-primary" />}>
          <ul className="list-disc list-inside space-y-2">
            <li>Access to relevant industry resources</li>
            <li>Professional development opportunities</li>
            <li>Networking with industry professionals</li>
          </ul>
        </PersonaSection>
      </Card>
    </div>
  );
};