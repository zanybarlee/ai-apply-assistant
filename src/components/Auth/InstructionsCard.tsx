import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const InstructionsCard = () => {
  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
        <CardDescription>
          This application will take approximately 15 minutes to complete.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Required Documents</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>A copy of your Certificate of Completion and exam result slips (if relevant)</li>
            <li>A copy of your CV / Resume (applicable for IBF Advanced only)</li>
            <li>Experience Requirement Form endorsed by your HR / Supervisor (applicable for IBF Advanced only)</li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            You may save a draft of your application at any point of the application.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Criteria for IBF Certification</h3>
          <p className="text-sm text-muted-foreground">* TSC refers to Technical Skill Competency</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Terms and Conditions</h3>
          <p className="text-sm">
            Please read the Terms and Conditions of being an IBF-Certified Individual. As an IBF-Certified individual, 
            you would be expected to observe the Code of Ethics and Standards of Professional Conduct and to commit 
            to a Continuous Professional Development (CPD) requirement of 15 hours per annum.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2">Certification Application Fee</h3>
          <p className="text-sm">Certification application fee is waived till further notice.</p>
        </div>
      </CardContent>
    </Card>
  );
};