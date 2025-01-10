import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ValidationAlertProps {
  isValid: boolean;
  message: string;
}

export const ValidationAlert = ({ isValid, message }: ValidationAlertProps) => (
  <Alert variant={isValid ? "default" : "destructive"} className="mt-2">
    <div className="flex items-center gap-2">
      {isValid ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertDescription>{message}</AlertDescription>
    </div>
  </Alert>
);