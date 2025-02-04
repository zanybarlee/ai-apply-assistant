import { Calendar } from "@/components/ui/calendar";
import { Consultation } from "./types";
import { CalendarDay } from "./CalendarDay";

interface ConsultationCalendarProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  consultations: Consultation[];
}

export const ConsultationCalendar = ({ date, onSelect, consultations }: ConsultationCalendarProps) => {
  const bookedDates = consultations.map(
    consultation => new Date(consultation.consultation_date)
  );

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
          <CalendarDay day={dayDate} consultations={consultations} />
        ),
      }}
    />
  );
};