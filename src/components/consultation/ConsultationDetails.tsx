import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PopoverContent } from "@/components/ui/popover";
import { Consultation } from "./types";

interface ConsultationDetailsProps {
  consultation: Consultation;
}

export const ConsultationDetails = ({ consultation }: ConsultationDetailsProps) => {
  return (
    <PopoverContent 
      className="w-80 p-4" 
      sideOffset={5}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <div className="space-y-2">
        <h4 className="font-medium">Consultation Details</h4>
        <div className="grid gap-1">
          <div className="text-sm">
            <span className="font-medium">Date: </span>
            {format(new Date(consultation.consultation_date), 'PPP')}
          </div>
          <div className="text-sm">
            <span className="font-medium">Type: </span>
            {consultation.consultation_type.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </div>
          <div className="text-sm">
            <span className="font-medium">Status: </span>
            <span className={cn(
              "capitalize",
              consultation.status === 'confirmed' && "text-green-600",
              consultation.status === 'pending' && "text-yellow-600",
              consultation.status === 'cancelled' && "text-red-600"
            )}>
              {consultation.status}
            </span>
          </div>
          {consultation.notes && (
            <div className="text-sm">
              <span className="font-medium">Notes: </span>
              {consultation.notes}
            </div>
          )}
        </div>
      </div>
    </PopoverContent>
  );
};