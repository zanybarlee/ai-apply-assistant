import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C5D82D] to-[#004D40]">
      {/* Navigation Bar */}
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
          <Button variant="ghost" className="text-secondary hover:text-primary">
            Login
          </Button>
          <Button variant="ghost" className="text-secondary hover:text-primary">
            FAQs
          </Button>
          <Button className="bg-primary text-secondary hover:bg-primary/90">
            Subscribe
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Introducing the Sustainable Finance Jobs Transformation Map
            </h1>
            <p className="text-white/90 text-lg">
              Discover how we're transforming the financial sector workforce for a sustainable future.
            </p>
            <Button className="bg-primary text-secondary hover:bg-primary/90">
              Find out more
            </Button>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/abc5347e-3b6b-4186-909e-f834c98f3f94.png" 
              alt="IBF Illustration" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="text-6xl text-primary">"</div>
          <p className="text-xl md:text-2xl text-white leading-relaxed">
            We remain committed to the partnership between IBF, financial institutions, government and unions to support a dynamic and skilled financial sector workforce.
          </p>
          <div className="text-white">
            <p className="font-bold">Chia Der Jiun</p>
            <p className="text-sm">Chairman, IBF</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;