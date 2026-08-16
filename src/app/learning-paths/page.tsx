"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser, useDoc, initializeFirebase } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, BookOpen, Users, ArrowLeft, CheckCircle, Clock, Star } from "lucide-react";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

type Plan = { 
  learningPath: string;
  missingSkills?: string[];
  mentors?: Array<{ id: string; name?: string; skills?: string[] }>;
};

type UserProfile = {
  name?: string;
  skills?: string[];
  goal?: string;
  college?: string;
  degree?: string;
};

export default function LearningPathsPage() {
  const { user } = useUser();
  const { firestore } = initializeFirebase();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [skills, setSkills] = useState("");
  const [goal, setGoal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showInputs, setShowInputs] = useState(false);

  // Fetch user profile from Firestore
  const profileRef = useMemo(() => (user?.uid ? doc(firestore, "users", user.uid) : null), [firestore, user?.uid]);
  const { data: profile } = useDoc<UserProfile>(profileRef);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!user || user.isAnonymous) { 
        setLoading(false); 
        return; 
      }
      
      try {
        const res = await fetch('/api/ai/learning-path', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid }),
        });
        const data = await res.json();
        if (!ignore) {
          setPlan(data || null);
          // If we have profile data but no plan, auto-populate inputs
          if (!data && profile?.skills && profile?.goal) {
            setSkills(profile.skills.join(', '));
            setGoal(profile.goal);
            setShowInputs(true); // Show inputs by default on dedicated page
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true };
  }, [user, profile]);

  async function onGenerate() {
    if (!user || user.isAnonymous) return;
    setSubmitting(true);
    try {
      const body: any = { userId: user.uid };
      if (skills.trim().length) body.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (goal.trim().length) body.goal = goal.trim();
      const res = await fetch('/api/ai/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setPlan(res.ok ? (data || null) : null);
      setShowInputs(false); // Hide inputs after generating
    } finally {
      setSubmitting(false);
    }
  }

  const weeks = useMemo(() => {
    if (!plan?.learningPath) return [] as string[];
    return plan.learningPath
      .split(/\n+/)
      .filter((ln) => /week\s*\d+/i.test(ln) || ln.trim().length > 0)
      .slice(0, 12);
  }, [plan]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-gray-900">Learning Paths</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your personalized AI-powered learning roadmap based on your skills and career goals from signup
            </p>
          </div>

          {/* Profile Information Display */}
          {profile && (
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  Your Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.name || 'Not provided'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">College</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.college || 'Not provided'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Degree</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.degree || 'Not provided'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Career Goal</p>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-gray-900 font-medium">{profile.goal || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-3">Current Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No skills provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input Section - Show if no profile data or user wants to modify */}
          {(!profile?.skills || !profile?.goal || showInputs) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">
                  {profile?.skills && profile?.goal ? 'Update Your Information' : 'Complete Your Profile'}
                </CardTitle>
                <p className="text-gray-600">
                  {profile?.skills && profile?.goal 
                    ? 'Modify your skills and goals to generate a new learning path'
                    : 'Please provide your skills and career goals to generate a personalized learning path'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Your Skills</label>
                    <Input
                      placeholder="e.g., JavaScript, Python, React, SQL"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="h-12"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          onGenerate();
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Career Goal</label>
                    <Input
                      placeholder="e.g., Frontend Developer, Data Scientist"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="h-12"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          onGenerate();
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">What role do you want to achieve?</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={onGenerate} 
                    disabled={submitting || !user || user.isAnonymous}
                    className="px-6 py-2"
                  >
                    {submitting ? 'Generating…' : 'Generate Learning Path'}
                  </Button>
                  {(profile?.skills && profile?.goal) && (
                    <Button variant="outline" onClick={() => setShowInputs(false)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action buttons for users with profile data */}
          {(profile?.skills && profile?.goal && !showInputs) && (
            <div className="flex gap-3 mb-8">
              <Button 
                onClick={onGenerate} 
                disabled={submitting || !user || user.isAnonymous}
                size="lg"
                className="px-6"
              >
                {submitting ? 'Generating Learning Path…' : 'Generate New Learning Path'}
              </Button>
              <Button variant="outline" onClick={() => setShowInputs(true)} size="lg">
                Update Skills & Goals
              </Button>
            </div>
          )}

          {/* Learning Path Results */}
          {loading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <span className="ml-3 text-lg text-muted-foreground">Loading your learning path...</span>
                </div>
              </CardContent>
            </Card>
          ) : !plan ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2">Ready to Start Your Learning Journey?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {profile?.skills && profile?.goal 
                    ? "Click 'Generate New Learning Path' to create your personalized roadmap!" 
                    : "Complete your profile above to generate a personalized learning path tailored to your goals."}
                </p>
                {profile?.skills && profile?.goal && (
                  <Button onClick={onGenerate} disabled={submitting} size="lg">
                    {submitting ? 'Generating…' : 'Generate Learning Path'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Missing Skills Section */}
              {plan.missingSkills && plan.missingSkills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Target className="h-6 w-6 text-orange-600" />
                      Skills to Focus On
                    </CardTitle>
                    <p className="text-gray-600">These skills will help you achieve your career goal</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {plan.missingSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-orange-50 border-orange-200">
                          <Star className="h-4 w-4 text-orange-600" />
                          <span className="font-medium text-orange-800">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommended Mentors */}
              {plan.mentors && plan.mentors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="h-6 w-6 text-green-600" />
                      Recommended Mentors
                    </CardTitle>
                    <p className="text-gray-600">Connect with mentors who can guide your learning journey</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plan.mentors.map((mentor, index) => (
                        <div key={mentor.id} className="p-4 border rounded-lg bg-green-50 border-green-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center">
                              <Users className="h-4 w-4 text-green-700" />
                            </div>
                            <p className="font-semibold text-green-900">{mentor.name || `Mentor ${index + 1}`}</p>
                          </div>
                          {mentor.skills && (
                            <div className="flex flex-wrap gap-1">
                              {mentor.skills.slice(0, 3).map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {skill}
                                </Badge>
                              ))}
                              {mentor.skills.length > 3 && (
                                <span className="text-xs text-green-600 font-medium">+{mentor.skills.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Weekly Learning Path */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    Your 12-Week Learning Roadmap
                  </CardTitle>
                  <p className="text-gray-600">Follow this structured path to achieve your career goals</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weeks.map((w, i) => (
                      <Card key={i} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-700">{i + 1}</span>
                            </div>
                            <CardTitle className="text-lg text-blue-700">{`Week ${i + 1}`}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {w}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Button onClick={onGenerate} disabled={submitting} variant="outline" size="lg">
                  {submitting ? 'Regenerating…' : 'Generate New Path'}
                </Button>
                <Button onClick={() => setShowInputs(true)} variant="outline" size="lg">
                  Update Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
