import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClipboardList, Award, GraduationCap, TrendingUp } from "lucide-react";
import { CertificationCard } from "./CertificationCard";
import { TrainingProgramsDialog } from "./TrainingProgramsDialog";
import { CertificationsDialog } from "./CertificationsDialog";
import { ProgressDialog } from "./ProgressDialog";
import { StatisticsCard } from "./StatisticsCard";

interface DashboardViewProps {
  userId: string;
}

export const DashboardView = ({ userId }: DashboardViewProps) => {
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [isCertificationsDialogOpen, setIsCertificationsDialogOpen] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);

  const { data: certifications } = useQuery({
    queryKey: ["certifications", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_certifications")
        .select("*")
        .eq("user_id", userId);
      return data || [];
    },
  });

  const { data: trainingPrograms } = useQuery({
    queryKey: ["training_programs", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_training_programs")
        .select("*")
        .eq("user_id", userId);
      return data || [];
    },
  });

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CertificationCard />
        
        <StatisticsCard
          title="Training Programs"
          value={trainingPrograms?.length || 0}
          description="Click to view all programs"
          Icon={GraduationCap}
          onClick={() => setIsTrainingDialogOpen(true)}
        />
        
        <StatisticsCard
          title="Certifications"
          value={certifications?.length || 0}
          description="Your current certifications"
          Icon={ClipboardList}
          onClick={() => setIsCertificationsDialogOpen(true)}
        />
        
        <StatisticsCard
          title="Progress"
          value="75%"
          description="Overall completion rate"
          Icon={TrendingUp}
          onClick={() => setIsProgressDialogOpen(true)}
        />
      </div>

      <TrainingProgramsDialog
        open={isTrainingDialogOpen}
        onClose={() => setIsTrainingDialogOpen(false)}
        userId={userId}
      />

      <CertificationsDialog
        open={isCertificationsDialogOpen}
        onClose={() => setIsCertificationsDialogOpen(false)}
        userId={userId}
      />

      <ProgressDialog
        open={isProgressDialogOpen}
        onClose={() => setIsProgressDialogOpen(false)}
      />
    </div>
  );
};