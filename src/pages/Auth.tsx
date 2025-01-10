import { useEffect, useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AuthError } from "@supabase/supabase-js";

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
        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              This application will take approximately 15 minutes to complete.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Required Documents</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>A copy of your Certificate of Completion and exam result slips (if relevant)</li>
                <li>A copy of your CV / Resume (applicable for IBF Advanced only)</li>
                <li>Experience Requirement Form endorsed by your HR / Supervisor (applicable for IBF Advanced only)</li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground">
                You may save a draft of your application at any point of the application.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Criteria for IBF Certification</h3>
              <p className="text-sm text-muted-foreground">* TSC refers to Technical Skill Competency</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Terms and Conditions</h3>
              <p className="text-sm">
                Please read the Terms and Conditions of being an IBF-Certified Individual. As an IBF-Certified individual, 
                you would be expected to observe the Code of Ethics and Standards of Professional Conduct and to commit 
                to a Continuous Professional Development (CPD) requirement of 15 hours per annum.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Certification Application Fee</h3>
              <p className="text-sm">Certification application fee is waived till further notice.</p>
            </div>
          </CardContent>
        </Card>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome to IBF</CardTitle>
            <CardDescription>Sign in to continue with your application</CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#C5D82D",
                      brandAccent: "#D4E157",
                    }
                  }
                }
              }}
              theme="light"
              providers={[]}
              onError={(error) => {
                setErrorMessage(getErrorMessage(error));
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;