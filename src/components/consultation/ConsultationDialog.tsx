import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConsultationCalendar } from "./ConsultationCalendar";
import { useConsultations } from "./hooks/useConsultations";

export const ConsultationDialog = () => {
  const [date, setDate] = useState<Date>();
  const [consultationType, setConsultationType] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const consultations = useConsultations(isOpen);

  const handleSubmit = async () => {
    if (!date || !consultationType) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and consultation type.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("consultations").insert({
        consultation_date: date.toISOString(),
        consultation_type: consultationType,
        notes: notes || null,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Consultation Scheduled",
        description: "Your consultation has been successfully scheduled.",
      });
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error scheduling consultation:", error);
      toast({
        title: "Error",
        description: "Failed to schedule consultation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDate(undefined);
    setConsultationType("");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="link" 
          className="text-[#C5D82D] hover:text-[#004D40] p-0 mt-2 group-hover:translate-x-1 transition-transform"
        >
          Schedule Consultation →
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Consultation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Select Date</label>
            <ConsultationCalendar
              date={date}
              onSelect={setDate}
              consultations={consultations}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Consultation Type</label>
            <Select value={consultationType} onValueChange={setConsultationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career-coaching">Career Coaching</SelectItem>
                <SelectItem value="skills-assessment">Skills Assessment</SelectItem>
                <SelectItem value="learning-pathway">Learning Pathway</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Additional Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific topics you'd like to discuss?"
              className="resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Scheduling..." : "Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};