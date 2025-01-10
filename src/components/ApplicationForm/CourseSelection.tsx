import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Book, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  price: number;
  type: "Classroom" | "Synchronous" | "Asynchronous";
  eligibleSchemes: string[];
}

const courses: Course[] = [
  {
    id: "1",
    title: "Manage Financial Sector Change with Positive Intelligence (PQ)",
    provider: "COMPAS MANAGEMENT CONSULTING PTE. LTD.",
    duration: "16 Hours",
    price: 1200,
    type: "Classroom",
    eligibleSchemes: ["STS"],
  },
  {
    id: "2",
    title: "Certified Private Banker Level 3 - Managing Change",
    provider: "Wealth Management Institute Limited",
    duration: "4 Hours",
    price: 800,
    type: "Classroom",
    eligibleSchemes: ["STS"],
  },
  {
    id: "3",
    title: "Certificate for Family Office Practitioner - Family Office",
    provider: "Wealth Management Institute Limited",
    duration: "8 Hours",
    price: 2000,
    type: "Classroom",
    eligibleSchemes: ["STS"],
  },
];

interface CourseSelectionProps {
  selectedCourse: string;
  onChange: (courseId: string) => void;
}

export const CourseSelection = ({ selectedCourse, onChange }: CourseSelectionProps) => {
  const { toast } = useToast();
  const [completionDate, setCompletionDate] = useState<Date | null>(null);

  const handleCourseSelect = (courseId: string) => {
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    if (completionDate && completionDate < fiveYearsAgo) {
      toast({
        title: "Course Completion Date Warning",
        description: "Application must be made within 5 years from the completion of the IBF-STS accredited course.",
        variant: "destructive",
      });
      return;
    }

    onChange(courseId);
  };

  const selectedCourseDetails = courses.find(course => course.id === selectedCourse);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Select IBF-STS Accredited Course</Label>
        <p className="text-sm text-gray-600">
          Select courses from our suite of IBF-STS accredited courses that best meet your training needs.
          You can only be certified after successfully completing eligible IBF-STS accredited assessment courses.
        </p>
        
        <Select value={selectedCourse} onValueChange={handleCourseSelect}>
          <SelectTrigger className="w-full bg-white border-gray-200">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            {courses.map((course) => (
              <SelectItem 
                key={course.id} 
                value={course.id}
                className="hover:bg-gray-100 cursor-pointer"
              >
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCourseDetails && (
          <Card className="p-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{selectedCourseDetails.title}</h3>
                  <p className="text-sm text-gray-600">{selectedCourseDetails.provider}</p>
                </div>
                <Badge variant="secondary">
                  {selectedCourseDetails.type}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {selectedCourseDetails.duration}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {selectedCourseDetails.price.toFixed(2)}
                </div>
                <div className="flex items-center">
                  <Book className="h-4 w-4 mr-1" />
                  IBF-STS Accredited
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                {selectedCourseDetails.eligibleSchemes.map((scheme) => (
                  <Badge key={scheme} variant="outline">
                    {scheme}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};