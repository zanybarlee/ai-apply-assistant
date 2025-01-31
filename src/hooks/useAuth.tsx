import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          handleUnauthenticated("Session expired");
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth error:', error);
        handleUnauthenticated("Authentication error");
      }
    };

    const handleUnauthenticated = (message: string) => {
      setIsAuthenticated(false);
      toast({
        title: message,
        description: "Please log in again to continue.",
        variant: "destructive",
      });
      navigate('/auth');
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        handleUnauthenticated("Session ended");
      }
    });

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return { isAuthenticated };
};