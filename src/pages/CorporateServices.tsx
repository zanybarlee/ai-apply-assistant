import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Users2, Briefcase, GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CorporateServices = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FBF2] to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-[#004D40] hover:text-[#C5D82D] mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#004D40] mb-4">Corporate Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering financial institutions with comprehensive solutions for workforce development and certification.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 hover:shadow-lg transition-all duration-300">
            <Building2 className="h-12 w-12 text-[#C5D82D] mb-6" />
            <h2 className="text-2xl font-semibold text-[#004D40] mb-4">Institutional Support</h2>
            <p className="text-gray-600 mb-6">
              Tailored solutions to help financial institutions develop and maintain a skilled workforce through structured training programs and certifications.
            </p>
            <Button className="bg-[#C5D82D] text-[#004D40] hover:bg-[#D4E157]">Learn More</Button>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-all duration-300">
            <Users2 className="h-12 w-12 text-[#C5D82D] mb-6" />
            <h2 className="text-2xl font-semibold text-[#004D40] mb-4">Workforce Development</h2>
            <p className="text-gray-600 mb-6">
              Comprehensive strategies for employee upskilling, career progression, and professional development in the financial sector.
            </p>
            <Button className="bg-[#C5D82D] text-[#004D40] hover:bg-[#D4E157]">Learn More</Button>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-[#004D40] mb-8 text-center">Our Services Include</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <Briefcase className="h-6 w-6 text-[#C5D82D] flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#004D40] mb-2">Training Needs Analysis</h3>
                <p className="text-gray-600">Identify skill gaps and development opportunities within your organization.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <GraduationCap className="h-6 w-6 text-[#C5D82D] flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#004D40] mb-2">Certification Programs</h3>
                <p className="text-gray-600">Industry-recognized certifications for various financial roles.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Users2 className="h-6 w-6 text-[#C5D82D] flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#004D40] mb-2">Career Advisory</h3>
                <p className="text-gray-600">Expert guidance for employee career development and progression.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-[#004D40] text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workforce?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contact us to learn how our corporate services can help your organization thrive in the evolving financial landscape.
          </p>
          <Button className="bg-[#C5D82D] text-[#004D40] hover:bg-[#D4E157] text-lg px-8 py-6">
            Get in Touch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CorporateServices;