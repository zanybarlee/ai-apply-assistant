import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Check, X, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface IBFProgram {
  id: string;
  provider_name: string;
  program_name: string;
  program_url: string | null;
  certification_level: 'qualified' | 'advanced-2' | 'advanced-3';
}

interface IBFProgramsTableProps {
  userCertificationLevel?: string;
  yearsOfExperience?: number;
  selectedPrograms: string[];
  onProgramSelect: (programId: string, isSelected: boolean) => void;
}

export const IBFProgramsTable = ({ 
  userCertificationLevel, 
  yearsOfExperience,
  selectedPrograms,
  onProgramSelect
}: IBFProgramsTableProps) => {
  const { toast } = useToast();
  
  const { data: programs, isLoading } = useQuery({
    queryKey: ['ibf-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ibf_training_programs')
        .select('*')
        .order('provider_name');
      
      if (error) throw error;
      return data as IBFProgram[];
    }
  });

  const getEligibilityStatus = (programLevel: string) => {
    if (!userCertificationLevel) {
      return {
        status: 'pending',
        message: 'Please select a certification level',
        icon: <AlertCircle className="h-4 w-4 text-yellow-500" />
      };
    }

    const levels = ['qualified', 'advanced-2', 'advanced-3'];
    const userLevelIndex = levels.indexOf(userCertificationLevel);
    const programLevelIndex = levels.indexOf(programLevel);

    if (userLevelIndex === -1 || programLevelIndex === -1) {
      return {
        status: 'error',
        message: 'Invalid certification level',
        icon: <X className="h-4 w-4 text-destructive" />
      };
    }

    if (userLevelIndex >= programLevelIndex) {
      return {
        status: 'eligible',
        message: 'You are eligible for this program',
        icon: <Check className="h-4 w-4 text-green-500" />
      };
    }

    return {
      status: 'ineligible',
      message: 'Your certification level is not high enough for this program',
      icon: <X className="h-4 w-4 text-destructive" />
    };
  };

  const handleProgramSelect = (programId: string, isChecked: boolean) => {
    const program = programs?.find(p => p.id === programId);
    if (!program) return;

    const eligibility = getEligibilityStatus(program.certification_level);
    if (eligibility.status !== 'eligible' && isChecked) {
      toast({
        title: "Program Selection Error",
        description: "You are not eligible for this program based on your certification level.",
        variant: "destructive"
      });
      return;
    }

    onProgramSelect(programId, isChecked);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading IBF-STS programs...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">IBF-STS Accredited Programs</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select the programs you wish to enroll in. You can only select programs for which you are eligible.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Eligibility</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs?.map((program) => {
            const eligibility = getEligibilityStatus(program.certification_level);
            const isSelected = selectedPrograms.includes(program.id);

            return (
              <TableRow key={program.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleProgramSelect(program.id, checked as boolean)}
                    disabled={eligibility.status !== 'eligible'}
                  />
                </TableCell>
                <TableCell className="font-medium">{program.provider_name}</TableCell>
                <TableCell>{program.program_name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {program.certification_level.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-2">
                          {eligibility.icon}
                          <span className="text-sm">{eligibility.status}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{eligibility.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  {program.program_url ? (
                    <a 
                      href={program.program_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No link</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {(!programs || programs.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No IBF-STS programs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};