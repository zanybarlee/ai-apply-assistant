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
import { Badge } from "@/components/ui/badge";

interface CertificationsDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export const CertificationsDialog = ({ open, onClose, userId }: CertificationsDialogProps) => {
  const { data: certifications } = useQuery({
    queryKey: ["user_certifications", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_certifications")
        .select(`
          *,
          job_role:job_roles(
            title,
            industry_segment,
            certification_level
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
          <DialogTitle>Your Certifications</DialogTitle>
          <DialogDescription>
            View your certification applications and their current status
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-4">
            {certifications?.map((cert: any) => (
              <div
                key={cert.id}
                className="rounded-lg border p-4 hover:bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {cert.job_role?.title}
                  </h3>
                  <Badge variant={cert.status === 'draft' ? 'secondary' : 'default'}>
                    {cert.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Industry: {cert.industry_segment}
                </p>
                <p className="text-sm text-muted-foreground">
                  Level: {cert.job_role?.certification_level}
                </p>
                <p className="text-sm mt-2">
                  Experience: {cert.total_experience_years} years total, {cert.segment_experience_years} years in segment
                </p>
              </div>
            ))}
            {(!certifications || certifications.length === 0) && (
              <p className="text-center text-muted-foreground">
                No certifications found
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};