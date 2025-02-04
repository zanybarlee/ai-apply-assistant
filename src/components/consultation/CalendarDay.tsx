import { startOfDay, format } from "date-fns";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Consultation } from "./types";
import { ConsultationDetails } from "./ConsultationDetails";

interface CalendarDayProps {
  day: Date;
  consultations: Consultation[];
}

export const CalendarDay = ({ day, consultations }: CalendarDayProps) => {
  const dayStart = startOfDay(day);
  const consultation = consultations.find(c => {
    const consultationDate = startOfDay(new Date(c.consultation_date));
    return format(consultationDate, 'yyyy-MM-dd') === format(dayStart, 'yyyy-MM-dd');
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <span>{day.getDate()}</span>
      {consultation && (
        <div className="relative w-full h-full">
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="absolute inset-0 w-full h-full cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
              </button>
            </PopoverTrigger>
            <ConsultationDetails consultation={consultation} />
          </Popover>
        </div>
      )}
    </div>
  );
};