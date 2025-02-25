"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  console.log(process.env.PINECONE_API_KEY)
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && file.type === "application/pdf") {
        setFile(file);
      } else {
        toast({
          title: "Error",
          description: "Please upload a PDF file for your resume.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    const form = e.target as HTMLFormElement;

    // Add form fields to FormData
    formData.append("name", form.querySelector<HTMLInputElement>('[name="name"]')?.value || '');
    formData.append("email", form.querySelector<HTMLInputElement>('[name="email"]')?.value || '');
    formData.append("linkedin", form.querySelector<HTMLInputElement>('[name="linkedin"]')?.value || '');
    formData.append("skills", form.querySelector<HTMLTextAreaElement>('[name="skills"]')?.value || '');

    if (file) {
      formData.append("resume", file);
    } else {
      toast({
        title: "Error",
        description: "Please upload a PDF file for your resume.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    console.log("Form data:", Object.fromEntries(formData.entries()));

    const uploadedFile = formData.get("resume");
    if (uploadedFile && !(uploadedFile as File).type.startsWith("application/pdf")) {
      toast({
        title: "Error",
        description: "Please upload a PDF file for your resume.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Submission failed:", errorText);
        throw new Error("Submission failed");
      }

      const data = await response.json();
      
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted!",
        duration: 5000,
      });

      alert("Application Submitted: Your application has been successfully submitted!");

      // Reset form
      (e.target as HTMLFormElement).reset();
      setFile(null);
    } catch (error) {
      console.error("Error submitting application:", (error as Error).message);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Candidate Application Form
          </h1>
          <p className="text-lg text-gray-600">
            Submit your application and let our AI-powered system match you with the perfect role.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                required
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>

            <div className="space-y-2">
              <Label>Resume (PDF)</Label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-6 w-6 text-gray-600" />
                    <span className="text-gray-600">{file.name}</span>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Drag and drop your resume here, or click to select
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills & Experience</Label>
              <Textarea
                id="skills"
                name="skills"
                required
                placeholder="List your key skills and experience..."
                className="h-32"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}