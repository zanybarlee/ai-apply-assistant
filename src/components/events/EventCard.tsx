import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type Event = Tables<"events">;

interface EventCardProps {
  event: Event;
  isRegistered?: boolean;
  onRegister?: () => void;
  onUnregister?: () => void;
}

export const EventCard = ({ event, isRegistered, onRegister, onUnregister }: EventCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const handleRegistration = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for events",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistered) {
        const { error } = await supabase
          .from("event_registrations")
          .delete()
          .eq("event_id", event.id)
          .eq("user_id", user.id);

        if (error) throw error;
        onUnregister?.();
        toast({
          title: "Registration cancelled",
          description: "You have been unregistered from this event",
        });
      } else {
        const { error } = await supabase.from("event_registrations").insert({
          event_id: event.id,
          user_id: user.id,
          status: "confirmed"
        });

        if (error) throw error;
        onRegister?.();
        toast({
          title: "Registration successful",
          description: "You have been registered for this event",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-[#5D4037] mb-2">{event.title}</h3>
          <p className="text-gray-600">{event.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-[#C5D82D]" />
            <span>
              {format(new Date(event.start_date), "MMM d, yyyy h:mm a")} -{" "}
              {format(new Date(event.end_date), "h:mm a")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-[#C5D82D]" />
            <span>{event.location}</span>
          </div>

          {event.max_participants && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4 text-[#C5D82D]" />
              <span>
                {event.current_participants || 0} / {event.max_participants} participants
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={handleRegistration}
          disabled={isLoading}
          variant={isRegistered ? "outline" : "default"}
          className={
            isRegistered
              ? "w-full border-[#C5D82D] text-[#C5D82D] hover:bg-[#C5D82D] hover:text-white"
              : "w-full bg-[#C5D82D] text-white hover:bg-[#C5D82D]/90"
          }
        >
          {isRegistered ? "Cancel Registration" : "Register Now"}
        </Button>
      </div>
    </Card>
  );
};