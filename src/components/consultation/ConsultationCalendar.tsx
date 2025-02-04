import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Consultation } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ConsultationCalendarProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  consultations: Consultation[];
}

export const ConsultationCalendar = ({ date, onSelect, consultations }: ConsultationCalendarProps) => {
  const bookedDates = consultations.map(
    consultation => new Date(consultation.consultation_date)
  );

  console.log('Consultations:', consultations); // Debug log

  const renderDayContent = (day: Date) => {
    const consultation = consultations.find(
      c => format(new Date(c.consultation_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );

    console.log('Checking day:', format(day, 'yyyy-MM-dd'), 'Consultation:', consultation); // Debug log

    if (consultation) {
      return (
        <div className="relative w-full h-full">
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="absolute inset-0 w-full h-full cursor-pointer hover:bg-accent/50 rounded-md transition-colors z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Popover trigger clicked'); // Debug log
                }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-4 z-50" 
              sideOffset={5}
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                console.log('Popover opened'); // Debug log
              }}
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
          </Popover>
        </div>
      );
    }
    return null;
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={onSelect}
      className="rounded-md border"
      disabled={(date) => date < new Date()}
      modifiers={{ booked: bookedDates }}
      modifiersStyles={{
        booked: {
          fontWeight: "bold",
          color: "var(--primary)",
        }
      }}
      components={{
        DayContent: ({ date: dayDate }) => (
          <div className="relative w-full h-full flex items-center justify-center">
            <span className="z-0">{dayDate.getDate()}</span>
            {renderDayContent(dayDate)}
          </div>
        ),
      }}
    />
  );
};