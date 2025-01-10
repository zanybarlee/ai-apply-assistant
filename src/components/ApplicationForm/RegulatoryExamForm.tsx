import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentUpload } from "./DocumentUpload";
import { supabase } from "@/integrations/supabase/client";

export const RegulatoryExamForm = () => {
  const { toast } = useToast();
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState<string>("");
  const [completionDate, setCompletionDate] = useState("");

  const handleTextExtracted = async (text: string) => {
    // Handle the extracted text if needed
    console.log("Extracted text:", text);
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('regulatory_exams')
        .insert([
          {
            user_id: user.id,
            exam_name: examName,
            exam_type: examType as any,
            completion_date: completionDate,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Exam Record Added",
        description: "Your regulatory exam has been recorded successfully.",
      });

      // Reset form
      setExamName("");
      setExamType("");
      setCompletionDate("");
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error",
        description: "Failed to save exam record. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold">Industry/Regulatory Examination</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="examType">Exam Type</Label>
          <Select value={examType} onValueChange={setExamType}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select exam type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CMFAS_M8">CMFAS Module 8</SelectItem>
              <SelectItem value="CMFAS_M9">CMFAS Module 9</SelectItem>
              <SelectItem value="CMFAS_M10">CMFAS Module 10</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="examName">Exam Name</Label>
          <Input
            id="examName"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="Enter exam name"
            className="bg-white"
          />
        </div>

        <div>
          <Label htmlFor="completionDate">Completion Date</Label>
          <Input
            id="completionDate"
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="bg-white"
          />
        </div>

        <div>
          <Label>Upload Result Slip (PDF)</Label>
          <DocumentUpload onTextExtracted={handleTextExtracted} />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary/90 transition-colors"
          disabled={!examName || !examType || !completionDate}
        >
          Submit Exam Record
        </button>
      </div>
    </div>
  );
};