import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PersonalInfoProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

export const PersonalInfo = ({ formData, onChange }: PersonalInfoProps) => {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Auto-capitalize names
  const handleNameChange = (field: string, value: string) => {
    const capitalizedValue = value.replace(/\b\w/g, (c) => c.toUpperCase());
    onChange(field, capitalizedValue);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    let formatted = numbers;
    if (numbers.length > 3) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }
    if (numbers.length > 6) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
    return formatted;
  };

  // Auto-complete email domain
  const handleEmailChange = (value: string) => {
    onChange("email", value);
    if (value.includes("@") && !value.includes(".")) {
      const domain = value.split("@")[1];
      const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
      const matches = commonDomains.filter((d) => d.startsWith(domain));
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const applyEmailSuggestion = (domain: string) => {
    const emailPrefix = formData.email.split("@")[0];
    onChange("email", `${emailPrefix}@${domain}`);
    setSuggestions([]);
    toast({
      title: "Email Updated",
      description: "Email domain has been auto-completed.",
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => handleNameChange("firstName", e.target.value)}
          className="transition-all duration-200 focus:ring-accent"
          placeholder="Enter your first name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => handleNameChange("lastName", e.target.value)}
          className="transition-all duration-200 focus:ring-accent"
          placeholder="Enter your last name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleEmailChange(e.target.value)}
          className="transition-all duration-200 focus:ring-accent"
          placeholder="Enter your email"
        />
        {suggestions.length > 0 && (
          <div className="mt-1 p-2 bg-white border rounded-md shadow-sm">
            {suggestions.map((domain) => (
              <button
                key={domain}
                onClick={() => applyEmailSuggestion(domain)}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
              >
                {domain}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onChange("phone", formatPhoneNumber(e.target.value))}
          className="transition-all duration-200 focus:ring-accent"
          placeholder="Enter your phone number"
          maxLength={12}
        />
      </div>
    </div>
  );
};