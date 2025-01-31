import { Card } from "@/components/ui/card";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileForm } from "./ProfileForm";
import { PersonaCards } from "./PersonaCards";

interface ProfileContentProps {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  loading: boolean;
  onProfileChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export const ProfileContent = ({ 
  profile, 
  loading, 
  onProfileChange, 
  onSubmit 
}: ProfileContentProps) => {
  return (
    <div className="space-y-8">
      <ProfileHeader 
        firstName={profile.firstName} 
        lastName={profile.lastName} 
      />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <ProfileForm
              profile={profile}
              loading={loading}
              onProfileChange={onProfileChange}
              onSubmit={onSubmit}
            />
          </Card>

          <PersonaCards firstName={profile.firstName} />
        </div>
      </div>
    </div>
  );
};