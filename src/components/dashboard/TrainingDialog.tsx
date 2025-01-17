import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TrainingDialogProps {
  open: boolean;
  onClose: () => void;
}

export const TrainingDialog = ({ open, onClose }: TrainingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Training Programs</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <DialogDescription>
          View available training programs and track your progress
        </DialogDescription>
        {/* Training program content will be added here */}
      </DialogContent>
    </Dialog>
  );
};