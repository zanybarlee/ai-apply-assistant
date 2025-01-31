import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const SingPassLogin = () => {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        // Simulate successful login after QR scan
        toast({
          title: "Login Successful",
          description: "Welcome back to IBF Certification Portal",
        });
        navigate("/certification");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isScanning, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C5D82D] to-[#004D40] p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/lovable-uploads/a976bc53-f7d1-43cc-9a67-cfc81f49584d.png"
              alt="SingPass Logo"
              className="h-12 mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-900">Log in with Singpass</h2>
            <p className="text-sm text-gray-600 text-center">
              Your trusted digital identity
            </p>
            
            <div className="relative mt-6">
              {isScanning ? (
                <div className="flex flex-col items-center space-y-4">
                  <LoadingSpinner />
                  <p className="text-sm text-gray-600">Scanning QR code...</p>
                </div>
              ) : (
                <div 
                  className="border-2 border-red-500 p-8 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setIsScanning(true)}
                >
                  <div className="w-48 h-48 bg-white flex items-center justify-center">
                    <div className="text-4xl font-bold text-gray-300">QR</div>
                  </div>
                  <p className="text-sm text-center mt-4 text-gray-600">
                    Scan with Singpass app<br />to log in
                  </p>
                </div>
              )}
            </div>

            <div className="w-full pt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Need help?
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 text-sm text-blue-600">
              <a href="#" className="hover:underline">Register for Singpass</a>
              <a href="#" className="hover:underline">Download Singpass app</a>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">⚠️ Beware of scam calls, SMS or emails</span><br />
            We were alerted to users receiving calls informing them of an urgent Singpass account termination. This call is a scam and not from Singpass. Please do not follow the instructions or respond to the scammer.
          </p>
        </Card>
      </div>
    </div>
  );
};