import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentUpload } from "./DocumentUpload";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamMetadata {
  exam_type: string;
  exam_name: string;
  exam_completion_date: string;
}

interface ExaminationCertificate {
  id: number;
  exam_type: string;
  exam_name: string;
  exam_completion_date: string;
  file_url: string | null;
  created_at: string;
}

export const RegulatoryExamForm = () => {
  const { toast } = useToast();
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState<string>("");
  const [completionDate, setCompletionDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [certificates, setCertificates] = useState<ExaminationCertificate[]>([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('examination_certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch examination certificates.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch('http://localhost:9002/upload_exam_certificate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      console.log('Upload response:', data);

      if (data.status === "processed successfully") {
        const { exam_metadata } = data;
        
        const { error } = await supabase
          .from('examination_certificates')
          .insert([{
            exam_type: exam_metadata.exam_type,
            exam_name: exam_metadata.exam_name,
            exam_completion_date: exam_metadata.completion_date,
            file_url: data.file_url,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Exam certificate uploaded successfully.",
        });

        fetchCertificates();
        return data.filename;
      }

      return null;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process exam certificate.",
        variant: "destructive",
      });
      return null;
    }
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

      // Reset form and refresh certificates
      setExamName("");
      setExamType("");
      setCompletionDate("");
      await fetchCertificates();
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error",
        description: "Failed to save exam record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
          <DocumentUpload onTextExtracted={handleFileUpload} />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary/90 transition-colors"
          disabled={!examName || !examType || !completionDate || isUploading}
        >
          {isUploading ? "Uploading..." : "Submit Exam Record"}
        </button>

        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4">Uploaded Certificates</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Type</TableHead>
                <TableHead>Exam Name</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>{cert.exam_type}</TableCell>
                  <TableCell>{cert.exam_name}</TableCell>
                  <TableCell>{cert.exam_completion_date ? formatDate(cert.exam_completion_date) : 'N/A'}</TableCell>
                  <TableCell>{formatDate(cert.created_at)}</TableCell>
                  <TableCell>
                    {cert.file_url ? (
                      <a 
                        href={cert.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </a>
                    ) : (
                      <span className="text-muted-foreground">No file</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {certificates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No certificates uploaded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
