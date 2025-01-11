import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface IBFProgram {
  id: string;
  provider_name: string;
  program_name: string;
  program_url: string | null;
  certification_level: 'qualified' | 'advanced-2' | 'advanced-3';
}

export const IBFProgramsTable = () => {
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

  if (isLoading) {
    return <div className="text-center py-4">Loading IBF-STS programs...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">IBF-STS Accredited Programs</h3>
        <p className="text-sm text-muted-foreground mt-1">
          These programs are recognized by the Institute of Banking and Finance Singapore (IBF).
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs?.map((program) => (
            <TableRow key={program.id}>
              <TableCell className="font-medium">{program.provider_name}</TableCell>
              <TableCell>{program.program_name}</TableCell>
              <TableCell className="capitalize">{program.certification_level.replace('-', ' ')}</TableCell>
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
          ))}
          {(!programs || programs.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                No IBF-STS programs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};