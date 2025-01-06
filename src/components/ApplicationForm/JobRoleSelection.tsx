import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface JobRole {
  id: string;
  title: string;
  level: string;
  skills: string[];
  industry: string;
}

const jobRoles: JobRole[] = [
  {
    id: "1",
    title: "Private Banking Relationship Manager",
    level: "Advanced",
    skills: ["Wealth Planning", "Portfolio Management", "Risk Management"],
    industry: "Private Banking",
  },
  {
    id: "2",
    title: "Family Office Advisor",
    level: "Advanced",
    skills: ["Estate Planning", "Tax Advisory", "Investment Management"],
    industry: "Wealth Management",
  },
  {
    id: "3",
    title: "Compliance Officer",
    level: "Qualified",
    skills: ["Regulatory Compliance", "Risk Assessment", "Policy Implementation"],
    industry: "Banking",
  },
  // Add more roles as needed
];

interface JobRoleSelectionProps {
  selectedRole: string;
  onChange: (roleId: string) => void;
}

export const JobRoleSelection = ({ selectedRole, onChange }: JobRoleSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Select Job Role</Label>
        <p className="text-sm text-gray-600">
          Select a job role from the Skills Framework for Financial Services (SFwFS) to determine the required skills.
        </p>
        
        <RadioGroup value={selectedRole} onValueChange={onChange} className="space-y-4">
          {jobRoles.map((role) => (
            <Card key={role.id} className="relative p-4 cursor-pointer hover:border-primary transition-colors">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={role.id} id={`role-${role.id}`} className="mt-1" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Label htmlFor={`role-${role.id}`} className="text-base font-medium">
                        {role.title}
                      </Label>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">{role.industry}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {role.level}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {role.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};