import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
}

export const ProfileHeader = ({ firstName, lastName }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center space-x-4">
      <ProfileAvatar firstName={firstName} lastName={lastName} />
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500">Manage your personal information</p>
      </div>
    </div>
  );
};