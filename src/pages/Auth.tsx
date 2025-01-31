import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { AuthError } from "@supabase/supabase-js";
import { LoginCard } from "@/components/Auth/LoginCard";
import { InstructionsCard } from "@/components/Auth/InstructionsCard";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          navigate("/");
        }
        if (event === "SIGNED_OUT") {
          setErrorMessage(""); // Clear errors on sign out
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password. Please check your credentials and try again.";
      case "Email not confirmed":
        return "Please verify your email address before signing in.";
      default:
        return error.message;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C5D82D] to-[#004D40] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <LoginCard errorMessage={errorMessage} />
        <InstructionsCard />
      </div>
    </div>
  );
};

export default Auth;