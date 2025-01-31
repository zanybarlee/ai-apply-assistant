import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PersonaSection } from "@/components/profile/PersonaSection";
import { 
  Sidebar, 
  SidebarContent,
  SidebarProvider,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  FileText, 
  Target, 
  ThumbsUp, 
  ChevronLeft,
  ClipboardList 
} from "lucide-react";

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
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="h-[60px] flex items-center px-6 border-b">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/')} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            {/* Sidebar content can be added here if needed */}
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <Card className="p-6 animate-fadeIn">
                <ProfileHeader 
                  firstName={profile.firstName} 
                  lastName={profile.lastName} 
                />
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <ProfileForm
                    profile={profile}
                    loading={loading}
                    onProfileChange={handleProfileChange}
                    onSubmit={handleUpdate}
                  />
                </Card>

                <div className="space-y-6">
                  <Card className="p-6">
                    <PersonaSection title="Bio" icon={<FileText className="w-5 h-5 text-primary" />}>
                      <p>Finance professional with experience in {profile.firstName}'s field, focused on continuous learning and professional development.</p>
                    </PersonaSection>
                  </Card>

                  <Card className="p-6">
                    <PersonaSection title="Goals" icon={<Target className="w-5 h-5 text-primary" />}>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Network and connect with industry peers</li>
                        <li>Enhance professional qualifications</li>
                        <li>Stay updated with industry trends</li>
                      </ul>
                    </PersonaSection>
                  </Card>

                  <Card className="p-6">
                    <PersonaSection title="Motivations" icon={<ThumbsUp className="w-5 h-5 text-primary" />}>
                      <p>Committed to professional growth and development in the financial sector, seeking opportunities to expand knowledge and expertise.</p>
                    </PersonaSection>
                  </Card>

                  <Card className="p-6">
                    <PersonaSection title="Expectations" icon={<ClipboardList className="w-5 h-5 text-primary" />}>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Access to relevant industry resources</li>
                        <li>Professional development opportunities</li>
                        <li>Networking with industry professionals</li>
                      </ul>
                    </PersonaSection>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;