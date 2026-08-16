"use client";

import React, { useState } from "react";
import { Upload, FileText, Zap, Save, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// Firebase imports removed for simplified version - can be re-added later
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface AnalysisResult {
  keywordMatch: number;
  atsScore: number;
  rewrittenBullets: string[];
}

export default function ResumeRadarPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [copiedBullets, setCopiedBullets] = useState<Set<number>>(new Set());

  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type === "text/plain")
    ) {
      setResumeFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} is ready for analysis.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or TXT file.",
        variant: "destructive",
      });
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const analyzeResume = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload a resume and provide a job description.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Extract text from resume file
      const resumeText = await extractTextFromFile(resumeFile);

      // Call API route (which uses Omnidim AI or mock data)
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          resumeUrl: null, // Skip Firebase Storage for now
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);

      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description:
          "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyBulletPoint = async (bullet: string, index: number) => {
    try {
      await navigator.clipboard.writeText(bullet);
      setCopiedBullets((prev) => new Set(prev).add(index));
      toast({
        title: "Copied!",
        description: "Bullet point copied to clipboard.",
      });

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedBullets((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const saveVersion = async () => {
    if (!analysisResult) {
      toast({
        title: "Cannot save",
        description: "No analysis result to save.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For now, just save to localStorage for immediate functionality
      const savedVersions =
        typeof localStorage !== "undefined" &&
        typeof localStorage.getItem === "function"
          ? JSON.parse(localStorage.getItem("resumeRadarVersions") || "[]")
          : [];
      const newVersion = {
        ...analysisResult,
        resumeFileName: resumeFile?.name,
        jobDescription,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      };

      savedVersions.push(newVersion);
      if (
        typeof localStorage !== "undefined" &&
        typeof localStorage.setItem === "function"
      ) {
        localStorage.setItem(
          "resumeRadarVersions",
          JSON.stringify(savedVersions),
        );
      }

      toast({
        title: "Version saved!",
        description: "Your analysis has been saved locally.",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save failed",
        description: "Unable to save the analysis. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ResumeRadar
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real-Time Resume Analyzer powered by AI
            </p>
          </div>

          {/* Upload Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Resume
                </CardTitle>
                <CardDescription>
                  Upload your resume in PDF or TXT format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {resumeFile && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FileText className="h-4 w-4" />
                      {resumeFile.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>
                  Paste the job description you're targeting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Analyze Button */}
          <div className="text-center mb-8">
            <Button
              onClick={analyzeResume}
              disabled={!resumeFile || !jobDescription.trim() || isAnalyzing}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing your resume...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          {analysisResult && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Analysis Results
                </h2>
                <Button onClick={saveVersion} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Version
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Keyword Match Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Keyword Match Score
                      <span
                        className={`text-2xl font-bold ${getScoreColor(analysisResult.keywordMatch)}`}
                      >
                        {analysisResult.keywordMatch}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress
                        value={analysisResult.keywordMatch}
                        className="h-3"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Percentage of job keywords found in your resume
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* ATS Compatibility Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      ATS Compatibility Score
                      <span
                        className={`text-2xl font-bold ${getScoreColor(analysisResult.atsScore)}`}
                      >
                        {analysisResult.atsScore}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress
                        value={analysisResult.atsScore}
                        className="h-3"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Based on structure and clarity for ATS systems
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Rewritten Bullet Points */}
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Bullet Points</CardTitle>
                  <CardDescription>
                    AI-improved versions of your resume bullet points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.rewrittenBullets.map((bullet, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            {bullet}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyBulletPoint(bullet, index)}
                          className="shrink-0"
                        >
                          {copiedBullets.has(index) ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
