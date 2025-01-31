import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, BriefcaseBusiness, Calendar, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export const CorporateSection = () => {
  return (
    <div className="py-12 bg-gradient-to-b from-[#F7FBF2] to-white">
      <div className="container mx-auto px-6">
        {/* Mission Statement */}
        <div className="mb-12 text-center">
          <div className="relative">
            <span className="text-[#C5D82D] text-6xl font-serif absolute -top-8 left-0">"</span>
            <p className="text-xl md:text-2xl text-[#5D4037] max-w-4xl mx-auto px-8">
              We remain committed to the partnership between IBF, financial institutions, government and
              unions to support a dynamic and skilled financial sector workforce.
            </p>
            <span className="text-[#C5D82D] text-6xl font-serif absolute -bottom-12 right-0">"</span>
          </div>
          <p className="mt-8 text-gray-600 font-semibold">Chia Der Jiun</p>
          <p className="text-gray-500">Chairman, IBF</p>
        </div>

        {/* How can we help section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#5D4037] mb-6">How can we help?</h2>
          <p className="text-gray-600 mb-8">
            As the appointed Jobs Development Partner for the financial sector, IBF serves as an
            integrated service provider in skills development, career advisory and workforce
            transformation.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/corporate-services" className="block">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <Building2 className="h-10 w-10 text-[#C5D82D] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-[#5D4037] mb-2 group-hover:text-[#004D40] transition-colors">
                Corporate Services
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive solutions for financial institutions and corporate partners.
              </p>
              <span className="text-[#C5D82D] group-hover:text-[#004D40] transition-colors inline-flex items-center">
                Learn More →
              </span>
            </Card>
          </Link>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <BriefcaseBusiness className="h-10 w-10 text-[#C5D82D] mb-4" />
            <h3 className="text-lg font-semibold text-[#5D4037] mb-2">Career Advisory</h3>
            <p className="text-gray-600 mb-4">
              Professional guidance for career development in the financial sector.
            </p>
            <Button variant="link" className="text-[#C5D82D] hover:text-[#004D40] p-0">
              Learn More →
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Calendar className="h-10 w-10 text-[#C5D82D] mb-4" />
            <h3 className="text-lg font-semibold text-[#5D4037] mb-2">Events</h3>
            <p className="text-gray-600 mb-4">
              Industry events, workshops, and networking opportunities.
            </p>
            <Button variant="link" className="text-[#C5D82D] hover:text-[#004D40] p-0">
              Learn More →
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <GraduationCap className="h-10 w-10 text-[#C5D82D] mb-4" />
            <h3 className="text-lg font-semibold text-[#5D4037] mb-2">IBF Accredited Programmes</h3>
            <p className="text-gray-600 mb-4">
              Quality training programs endorsed by industry experts.
            </p>
            <Button variant="link" className="text-[#C5D82D] hover:text-[#004D40] p-0">
              Learn More →
            </Button>
          </Card>
        </div>

        {/* Banner Image */}
        <div className="mt-12 relative rounded-lg overflow-hidden">
          <img 
            src="/lovable-uploads/e34211ad-737d-4b9f-925a-1f83f82beee3.png" 
            alt="IBF Corporate Banner" 
            className="w-full h-[300px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D40]/80 to-transparent flex items-center">
            <div className="p-8 max-w-xl">
              <h2 className="text-3xl font-bold text-white mb-4">
                Introducing the Sustainable Finance Jobs Transformation Map (SF JTM)
              </h2>
              <Button variant="secondary" className="bg-[#C5D82D] hover:bg-[#D4E157] text-[#004D40]">
                Find out more →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};