import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./EventCard";
import { useEffect, useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

export const EventsSection = () => {
  const { isAuthenticated } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data as Tables<"events">[];
    },
  });

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!isAuthenticated) return;

      const { data } = await supabase
        .from("event_registrations")
        .select("event_id")
        .eq("status", "confirmed");

      if (data) {
        setRegisteredEvents(data.map((reg) => reg.event_id as string));
      }
    };

    fetchRegistrations();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5D82D]"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#5D4037] mb-8">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={registeredEvents.includes(event.id)}
              onRegister={() => setRegisteredEvents([...registeredEvents, event.id])}
              onUnregister={() => setRegisteredEvents(registeredEvents.filter((id) => id !== event.id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};