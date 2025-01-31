import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
}

export const ProfileAvatar = ({ firstName, lastName }: ProfileAvatarProps) => {
  return (
    <Avatar className="h-20 w-20">
      <AvatarFallback className="text-lg">
        {firstName && lastName 
          ? `${firstName[0]}${lastName[0]}`
          : '👤'}
      </AvatarFallback>
    </Avatar>
  );
};