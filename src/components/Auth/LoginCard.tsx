import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SingPassLogin } from "@/components/ApplicationForm/SingPassLogin";

interface LoginCardProps {
  errorMessage: string;
}

export const LoginCard = ({ errorMessage }: LoginCardProps) => {
  return (
    <Card className="animate-fadeIn">
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
        <Tabs defaultValue="singpass" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="singpass">Singpass</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          <TabsContent value="singpass">
            <SingPassLogin />
          </TabsContent>
          <TabsContent value="email">
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
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};