import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ClipboardList, Award, GraduationCap, TrendingUp, UserCircle, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [showCertifications, setShowCertifications] = useState(false);
  const [showExams, setShowExams] = useState(false);
  const [showTraining, setShowTraining] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return data;
    },
    enabled: !!userId
  });

  const { data: certifications } = useQuery({
    queryKey: ['certifications', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('user_certifications')
        .select(`
          *,
          job_role:job_roles(*)
        `)
        .eq('user_id', userId)
        .eq('status', 'submitted');
      return data || [];
    },
    enabled: !!userId
  });

  const { data: exams } = useQuery({
    queryKey: ['exams', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('regulatory_exams')
        .select('*')
        .eq('user_id', userId);
      return data || [];
    },
    enabled: !!userId
  });

  const { data: trainingPrograms } = useQuery({
    queryKey: ['training_programs', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('user_training_programs')
        .select('*, training_program:training_programs(*)')
        .eq('user_id', userId);
      return data || [];
    },
    enabled: !!userId
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C5D82D] to-[#004D40]">
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
              <Link to="/certification" className="text-secondary hover:text-primary transition-colors">
                For Individuals
              </Link>
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
          <Link to="/profile">
            <Button variant="ghost" className="text-secondary hover:text-primary">
              <UserCircle className="w-5 h-5 mr-2" />
              Profile
            </Button>
          </Link>
          <Button variant="ghost" className="text-secondary hover:text-primary" onClick={handleLogout}>
            Logout
          </Button>
          <Button variant="ghost" className="text-secondary hover:text-primary">
            FAQs
          </Button>
          <Button className="bg-primary text-secondary hover:bg-primary/90">
            Subscribe
          </Button>
        </div>
      </nav>

      {/* Dashboard Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* MySkills Progress */}
          <Card className="p-6 bg-white/95">
            <h2 className="text-2xl font-bold text-[#5D4037] mb-6">MySkills Progress</h2>
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => setShowExams(true)}
              >
                <span className="text-gray-600">Exams ({exams?.length || 0} completed)</span>
                <ClipboardList className={exams?.length ? "text-green-500" : "text-gray-400"} />
              </div>
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => setShowCertifications(true)}
              >
                <span className="text-gray-600">Certifications ({certifications?.length || 0} in progress)</span>
                <Award className={certifications?.length ? "text-green-500" : "text-gray-400"} />
              </div>
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => setShowTraining(true)}
              >
                <span className="text-gray-600">Training ({trainingPrograms?.length || 0} completed)</span>
                <GraduationCap className={trainingPrograms?.length ? "text-green-500" : "text-gray-400"} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/95">
            <h2 className="text-2xl font-bold text-[#5D4037] mb-6">MySkills Portfolio</h2>
            <p className="text-gray-600 mb-4">I have successfully completed the following:</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-full bg-[#8D6E63] text-white">
                <div className="text-4xl font-bold">{exams?.length || 0}</div>
                <div className="text-sm mt-2">Examinations</div>
              </div>
              <div className="text-center p-4 rounded-full bg-[#C5D82D] text-white">
                <div className="text-4xl font-bold">{certifications?.length || 0}</div>
                <div className="text-sm mt-2">Certifications</div>
              </div>
              <div className="text-center p-4 rounded-full bg-[#5D4037] text-white">
                <div className="text-4xl font-bold">{trainingPrograms?.length || 0}</div>
                <div className="text-sm mt-2">Training Hours</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Join IBF Community */}
          <Card className="p-6 bg-white/95">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img src="/lovable-uploads/abc5347e-3b6b-4186-909e-f834c98f3f94.png" alt="IBF Logo" className="w-16 h-16" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#5D4037] mb-2">Welcome, {profile?.first_name || 'User'}!</h2>
                <p className="text-gray-600 mb-2">
                  <span className="text-[#C5D82D] font-bold">30818</span> professionals have attained IBF certification to date.
                </p>
                <Link to="/certification" className="text-[#C5D82D] hover:text-[#004D40] transition-colors">
                  Click here to find out more about IBF Certification.
                </Link>
              </div>
            </div>
          </Card>

          {/* MySkills Journey */}
          <Card className="p-6 bg-white/95">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="text-[#5D4037]" />
              <h2 className="text-2xl font-bold text-[#5D4037]">MySkills Journey</h2>
            </div>
            <p className="text-gray-600">
              {certifications?.length ? 
                `You have ${certifications.length} certification${certifications.length > 1 ? 's' : ''} in progress.` :
                'Start your certification journey today!'
              }
              <br />
              <Link to="/certification" className="text-[#C5D82D] hover:text-[#004D40] transition-colors">
                Click here
              </Link>{" "}
              to update your goals
            </p>
          </Card>
        </div>
      </div>

      <Dialog open={showCertifications} onOpenChange={setShowCertifications}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span>Certifications in Progress</span>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-4">
            <div className="space-y-4">
              {certifications?.map((cert: any) => (
                <Card key={cert.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{cert.job_role?.title}</h3>
                      <Badge variant="outline">{cert.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Industry: {cert.industry_segment}</p>
                      <p>Experience: {cert.segment_experience_years} years in segment</p>
                      <p>Total Experience: {cert.total_experience_years} years</p>
                    </div>
                  </div>
                </Card>
              ))}
              {(!certifications || certifications.length === 0) && (
                <p className="text-center text-gray-500 py-4">No certifications in progress</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Exams Dialog */}
      <Dialog open={showExams} onOpenChange={setShowExams}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span>Completed Exams</span>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-4">
            <div className="space-y-4">
              {exams?.map((exam) => (
                <Card key={exam.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{exam.exam_name}</h3>
                      <Badge variant="outline">{exam.exam_type}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Completion Date: {formatDate(exam.completion_date)}</p>
                      {exam.result_slip_url && (
                        <a 
                          href={exam.result_slip_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 flex items-center mt-2"
                        >
                          <ClipboardList className="h-4 w-4 mr-1" />
                          View Result Slip
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {(!exams || exams.length === 0) && (
                <p className="text-center text-gray-500 py-4">No exams completed yet</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Training Programs Dialog */}
      <Dialog open={showTraining} onOpenChange={setShowTraining}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span>Completed Training Programs</span>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-4">
            <div className="space-y-4">
              {trainingPrograms?.map((program) => (
                <Card key={program.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{program.training_program.program_name}</h3>
                      <Badge variant="outline">{program.training_program.provider_name}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Started: {formatDate(program.commencement_date)}</p>
                      <p>Completed: {formatDate(program.completion_date)}</p>
                      {program.certificate_url && (
                        <a 
                          href={program.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 flex items-center mt-2"
                        >
                          <GraduationCap className="h-4 w-4 mr-1" />
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {(!trainingPrograms || trainingPrograms.length === 0) && (
                <p className="text-center text-gray-500 py-4">No training programs completed yet</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
