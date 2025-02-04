import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Consultation } from "../types";

export const useConsultations = (isOpen: boolean) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching consultations:", error);
        return;
      }

      setConsultations(data || []);
    };

    fetchConsultations();
  }, [isOpen]);

  return consultations;
};