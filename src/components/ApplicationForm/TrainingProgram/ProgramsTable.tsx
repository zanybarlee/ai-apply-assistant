import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";

interface TrainingProgram {
  id: string;
  provider_name: string;
  program_name: string;
  validity_start: string;
  validity_end: string;
  file_url: string | null;
}

interface ProgramsTableProps {
  programs: TrainingProgram[];
}

export const ProgramsTable = ({ programs }: ProgramsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Training Programs</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Validity Start</TableHead>
            <TableHead>Validity End</TableHead>
            <TableHead>File</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell>{program.provider_name}</TableCell>
              <TableCell>{program.program_name}</TableCell>
              <TableCell>{formatDate(program.validity_start)}</TableCell>
              <TableCell>{formatDate(program.validity_end)}</TableCell>
              <TableCell>
                {program.file_url ? (
                  <a 
                    href={program.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </a>
                ) : (
                  <span className="text-muted-foreground">No file</span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {programs.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No training programs uploaded yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};