import { Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CertificationCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Certification</CardTitle>
        <Award className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">IBF Certification</div>
        <p className="text-xs text-muted-foreground">
          Get certified and enhance your professional credentials
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/certification">Apply Now</Link>
        </Button>
      </CardContent>
    </Card>
  );
};