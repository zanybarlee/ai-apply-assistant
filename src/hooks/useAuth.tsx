import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        
        if (!session) {
          // Clear any stale session data
          await supabase.auth.signOut();
          handleUnauthenticated("Please sign in");
        }
      } catch (error) {
        console.error('Auth error:', error);
        handleUnauthenticated("Authentication error");
      }
    };

    const handleUnauthenticated = (message: string) => {
      setIsAuthenticated(false);
      setUser(null);
      toast({
        title: "Session Expired",
        description: message,
        variant: "destructive",
      });
      navigate('/auth');
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        setUser(session?.user || null);
        navigate('/');
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        if (!session) {
          handleUnauthenticated("Session ended");
        }
      }
    });

    // Initial auth check
    checkAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { isAuthenticated, user };
};