import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TrainingProgramsDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export const TrainingProgramsDialog = ({ open, onClose, userId }: TrainingProgramsDialogProps) => {
  const { data: programs } = useQuery({
    queryKey: ["user_training_programs", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_training_programs")
        .select(`
          *,
          training_program:training_programs(
            program_name,
            provider_name,
            validity_start,
            validity_end
          )
        `)
        .eq("user_id", userId);
      return data || [];
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Training Programs</DialogTitle>
          <DialogDescription>
            View your enrolled training programs and their details
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-4">
            {programs?.map((program: any) => (
              <div
                key={program.id}
                className="rounded-lg border p-4 hover:bg-muted/50"
              >
                <h3 className="font-semibold">
                  {program.training_program?.program_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Provider: {program.training_program?.provider_name}
                </p>
                <div className="mt-2 text-sm">
                  <p>Started: {new Date(program.commencement_date).toLocaleDateString()}</p>
                  <p>Completed: {new Date(program.completion_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {(!programs || programs.length === 0) && (
              <p className="text-center text-muted-foreground">
                No training programs found
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};