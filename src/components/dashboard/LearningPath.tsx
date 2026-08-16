"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser, useDoc, initializeFirebase } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, BookOpen, Users } from "lucide-react";
import { doc } from "firebase/firestore";

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

export function LearningPath() {
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
    <section className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Target className="h-6 w-6 text-primary" />
        <h2 className="font-headline text-2xl">Your Personalized Learning Path</h2>
      </div>

      {/* Profile Information Display */}
      {profile && (
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Profile Information from Signup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-gray-900">{profile.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">College</p>
                <p className="text-gray-900">{profile.college || 'Not provided'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Career Goal</p>
              <p className="text-gray-900">{profile.goal || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No skills provided</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Section - Show only if no profile data or user wants to modify */}
      {(!profile?.skills || !profile?.goal || showInputs) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {profile?.skills && profile?.goal ? 'Update Your Information' : 'Complete Your Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Your Skills</label>
                <Input
                  placeholder="e.g., JavaScript, Python, React"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onGenerate();
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Career Goal</label>
                <Input
                  placeholder="e.g., Frontend Developer"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onGenerate();
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onGenerate} disabled={submitting || !user || user.isAnonymous}>
                {submitting ? 'Generating…' : 'Generate Plan'}
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
        <div className="flex gap-2 mb-6">
          <Button onClick={onGenerate} disabled={submitting || !user || user.isAnonymous}>
            {submitting ? 'Generating Learning Path…' : 'Generate Learning Path'}
          </Button>
          <Button variant="outline" onClick={() => setShowInputs(true)}>
            Update Skills & Goals
          </Button>
        </div>
      )}
      {/* Learning Path Results */}
      {loading ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading your learning path...</span>
            </div>
          </CardContent>
        </Card>
      ) : !plan ? (
        <Card>
          <CardContent className="py-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {profile?.skills && profile?.goal 
                ? "Click 'Generate Learning Path' to create your personalized roadmap!" 
                : "Complete your profile above to generate a personalized learning path."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Missing Skills Section */}
          {plan.missingSkills && plan.missingSkills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Skills to Focus On
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {plan.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Mentors */}
          {plan.mentors && plan.mentors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Recommended Mentors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.mentors.map((mentor, index) => (
                    <div key={mentor.id} className="p-3 border rounded-lg bg-green-50 border-green-200">
                      <p className="font-medium text-green-900">{mentor.name || `Mentor ${index + 1}`}</p>
                      {mentor.skills && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {mentor.skills.slice(0, 3).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs bg-green-100 text-green-800">
                              {skill}
                            </Badge>
                          ))}
                          {mentor.skills.length > 3 && (
                            <span className="text-xs text-green-600">+{mentor.skills.length - 3} more</span>
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
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Your 12-Week Learning Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeks.map((w, i) => (
                  <Card key={i} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-blue-700">{`Week ${i + 1}`}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {w}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
