interface ReviewProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    certificationLevel: string;
    purpose: string;
    amount: string;
    timeline: string;
  };
}

export const Review = ({ formData }: ReviewProps) => {
  const getCertificationLevelText = (level: string) => {
    switch (level) {
      case "qualified":
        return "IBF Qualified (Level 1)";
      case "advanced-2":
        return "IBF Advanced (Level 2)";
      case "advanced-3":
        return "IBF Advanced (Level 3)";
      default:
        return "Not specified";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            <p className="text-primary">{formData.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="text-primary">{formData.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-primary">{formData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-primary">{formData.phone}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Certification Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Certification Level</p>
            <p className="text-primary">{getCertificationLevelText(formData.certificationLevel)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Role</p>
            <p className="text-primary">{formData.purpose}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Years of Experience</p>
            <p className="text-primary">{formData.amount} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Course Completion Date</p>
            <p className="text-primary">{formData.timeline}</p>
          </div>
        </div>
      </div>
    </div>
  );
};