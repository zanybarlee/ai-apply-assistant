import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
];

interface JobRoleSelectionProps {
  selectedRole: string;
  onChange: (roleId: string) => void;
}

export const JobRoleSelection = ({ selectedRole, onChange }: JobRoleSelectionProps) => {
  const selectedJobRole = jobRoles.find(role => role.id === selectedRole);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Select Job Role</Label>
        <p className="text-sm text-gray-600">
          Select a job role from the Skills Framework for Financial Services (SFwFS) to determine the required skills.
        </p>
        
        <Select value={selectedRole} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a job role" />
          </SelectTrigger>
          <SelectContent>
            {jobRoles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedJobRole && (
          <Card className="p-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{selectedJobRole.title}</h3>
                  <p className="text-sm text-gray-600">{selectedJobRole.industry}</p>
                </div>
                <Badge variant="secondary">{selectedJobRole.level}</Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedJobRole.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};