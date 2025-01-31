import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { CorporateSection } from "@/components/landing/CorporateSection";
import { UserCircle } from "lucide-react";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { AIAssistant } from "@/components/ApplicationForm/AIAssistant";

const Index = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C5D82D] to-[#004D40]">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-white/90 backdrop-blur-sm">
        <div className="text-2xl font-bold text-secondary">IBF</div>
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink className="text-secondary hover:text-primary transition-colors" href="#">
                About IBF
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="text-secondary hover:text-primary transition-colors" href="#">
                For Individuals
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="text-secondary hover:text-primary transition-colors" href="#">
                For Financial Institutions
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="text-secondary hover:text-primary transition-colors" href="#">
                For Training Providers
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          {userId ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" className="text-secondary hover:text-primary">
                  <UserCircle className="w-5 h-5 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-secondary hover:text-primary" 
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate("/auth");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              className="bg-primary text-secondary hover:bg-primary/90"
              onClick={() => navigate("/auth")}
            >
              Login / Register
            </Button>
          )}
          <Button variant="ghost" className="text-secondary hover:text-primary">
            FAQs
          </Button>
          <Button className="bg-primary text-secondary hover:bg-primary/90">
            Subscribe
          </Button>
        </div>
      </nav>

      {userId ? (
        <>
          <DashboardView userId={userId} />
          <AIAssistant />
        </>
      ) : (
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Welcome to IBF PortalX
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Join over 30,818 professionals who have attained IBF certification
            </p>
            <Button 
              size="lg" 
              className="bg-white text-secondary hover:bg-white/90"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}

      {/* Corporate Section */}
      <CorporateSection />
    </div>
  );
};

export default Index;