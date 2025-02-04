import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Consultation } from "./types";

interface ConsultationCalendarProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  consultations: Consultation[];
}

export const ConsultationCalendar = ({ date, onSelect, consultations }: ConsultationCalendarProps) => {
  const bookedDates = consultations.map(
    consultation => new Date(consultation.consultation_date)
  );

  const renderDayContent = (day: Date) => {
    const consultation = consultations.find(
      c => format(new Date(c.consultation_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );

    if (consultation) {
      return (
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
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
        DayContent: ({ date }) => (
          <>
            {date.getDate()}
            {renderDayContent(date)}
          </>
        ),
      }}
    />
  );
};