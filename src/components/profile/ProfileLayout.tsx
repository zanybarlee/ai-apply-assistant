import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent,
  SidebarProvider,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";

interface ProfileLayoutProps {
  children: ReactNode;
}

export const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  const navigate = useNavigate();

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
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};