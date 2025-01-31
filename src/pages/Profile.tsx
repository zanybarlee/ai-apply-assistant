import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }

        setProfile(prev => ({ ...prev, email: user.email || "" }));

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone_number')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profileData) {
          setProfile(prev => ({
            ...prev,
            firstName: profileData.first_name || "",
            lastName: profileData.last_name || "",
            phoneNumber: profileData.phone_number || "",
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone_number: profile.phoneNumber,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.email) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6 space-y-8 animate-fadeIn">
        <ProfileHeader 
          firstName={profile.firstName} 
          lastName={profile.lastName} 
        />
        <ProfileForm
          profile={profile}
          loading={loading}
          onProfileChange={handleProfileChange}
          onSubmit={handleUpdate}
        />
      </Card>
    </div>
  );
};

export default Profile;