import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProfileFormProps {
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

export const ProfileForm = ({ 
  profile, 
  loading, 
  onProfileChange, 
  onSubmit 
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={profile.firstName}
            onChange={(e) => onProfileChange('firstName', e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={profile.lastName}
            onChange={(e) => onProfileChange('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={profile.email}
          disabled
          className="bg-gray-50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={profile.phoneNumber}
          onChange={(e) => onProfileChange('phoneNumber', e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={loading}
        >
          {loading && <LoadingSpinner className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};