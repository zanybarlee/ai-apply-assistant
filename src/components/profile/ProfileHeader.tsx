import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
}

export const ProfileHeader = ({ firstName, lastName }: ProfileHeaderProps) => {
  return (
    <div className="w-full bg-primary/20">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="flex items-center space-x-4">
          <ProfileAvatar firstName={firstName} lastName={lastName} />
          <div>
            <h2 className="text-xl font-semibold">
              {firstName || lastName ? `${firstName} ${lastName}` : 'Complete Your Profile'}
            </h2>
            <p className="text-gray-500">Manage your personal information and preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
};