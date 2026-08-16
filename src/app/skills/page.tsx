"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser, useDoc, initializeFirebase } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Star, 
  BookOpen, 
  Award, 
  Target, 
  Users, 
  ArrowLeft,
  Plus,
  CheckCircle,
  Clock,
  Zap,
  MessageCircle
} from "lucide-react";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CareerCoachWidget } from "@/components/chat/CareerCoachWidget";

type UserProfile = {
  name?: string;
  skills?: string[];
  goal?: string;
  college?: string;
  degree?: string;
};

type SkillDetail = {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  proficiency: number;
  description: string;
  category: string;
  relatedSkills: string[];
  learningResources: {
    title: string;
    type: 'Course' | 'Tutorial' | 'Documentation' | 'Practice';
    url: string;
  }[];
  jobDemand: 'High' | 'Medium' | 'Low';
  averageSalary: string;
};

// Comprehensive skill database
const skillsDatabase: Record<string, SkillDetail> = {
  'JavaScript': {
    name: 'JavaScript',
    level: 'Intermediate',
    proficiency: 75,
    description: 'A versatile programming language essential for web development, both frontend and backend.',
    category: 'Programming Language',
    relatedSkills: ['TypeScript', 'React', 'Node.js', 'Vue.js'],
    learningResources: [
      { title: 'JavaScript Complete Course', type: 'Course', url: '#' },
      { title: 'MDN JavaScript Guide', type: 'Documentation', url: '#' },
      { title: 'JavaScript30 Challenge', type: 'Practice', url: '#' }
    ],
    jobDemand: 'High',
    averageSalary: '₹6-12 LPA'
  },
  'Python': {
    name: 'Python',
    level: 'Advanced',
    proficiency: 85,
    description: 'A powerful, easy-to-learn programming language used in web development, data science, and AI.',
    category: 'Programming Language',
    relatedSkills: ['Django', 'Flask', 'Data Science', 'Machine Learning'],
    learningResources: [
      { title: 'Python for Everybody', type: 'Course', url: '#' },
      { title: 'Python.org Tutorial', type: 'Documentation', url: '#' },
      { title: 'LeetCode Python', type: 'Practice', url: '#' }
    ],
    jobDemand: 'High',
    averageSalary: '₹5-15 LPA'
  },
  'React': {
    name: 'React',
    level: 'Intermediate',
    proficiency: 70,
    description: 'A popular JavaScript library for building user interfaces, especially single-page applications.',
    category: 'Frontend Framework',
    relatedSkills: ['JavaScript', 'Redux', 'Next.js', 'TypeScript'],
    learningResources: [
      { title: 'React Official Tutorial', type: 'Tutorial', url: '#' },
      { title: 'React Documentation', type: 'Documentation', url: '#' },
      { title: 'React Projects', type: 'Practice', url: '#' }
    ],
    jobDemand: 'High',
    averageSalary: '₹6-14 LPA'
  },
  'Node.js': {
    name: 'Node.js',
    level: 'Intermediate',
    proficiency: 65,
    description: 'A JavaScript runtime for building scalable backend applications and APIs.',
    category: 'Backend Technology',
    relatedSkills: ['JavaScript', 'Express.js', 'MongoDB', 'REST APIs'],
    learningResources: [
      { title: 'Node.js Complete Guide', type: 'Course', url: '#' },
      { title: 'Node.js Documentation', type: 'Documentation', url: '#' },
      { title: 'Build REST APIs', type: 'Practice', url: '#' }
    ],
    jobDemand: 'High',
    averageSalary: '₹5-12 LPA'
  },
  'SQL': {
    name: 'SQL',
    level: 'Intermediate',
    proficiency: 80,
    description: 'Standard language for managing and manipulating relational databases.',
    category: 'Database',
    relatedSkills: ['MySQL', 'PostgreSQL', 'Database Design', 'Data Analysis'],
    learningResources: [
      { title: 'SQL Fundamentals', type: 'Course', url: '#' },
      { title: 'W3Schools SQL', type: 'Tutorial', url: '#' },
      { title: 'SQLBolt Practice', type: 'Practice', url: '#' }
    ],
    jobDemand: 'High',
    averageSalary: '₹4-10 LPA'
  },
  'HTML': {
    name: 'HTML',
    level: 'Advanced',
    proficiency: 90,
    description: 'The standard markup language for creating web pages and web applications.',
    category: 'Web Technology',
    relatedSkills: ['CSS', 'JavaScript', 'Web Accessibility', 'SEO'],
    learningResources: [
      { title: 'HTML5 Masterclass', type: 'Course', url: '#' },
      { title: 'MDN HTML Guide', type: 'Documentation', url: '#' },
      { title: 'HTML Projects', type: 'Practice', url: '#' }
    ],
    jobDemand: 'High',
    averageSalary: '₹3-8 LPA'
  },
  'CSS': {
    name: 'CSS',
    level: 'Intermediate',
    proficiency: 75,
    description: 'Stylesheet language used for describing the presentation of web pages.',
    category: 'Web Technology',
    relatedSkills: ['HTML', 'Sass', 'Tailwind CSS', 'Responsive Design'],
    learningResources: [
      { title: 'CSS Grid & Flexbox', type: 'Course', url: '#' },
      { title: 'CSS-Tricks', type: 'Tutorial', url: '#' },
      { title: 'CSS Challenges', type: 'Practice', url: '#' }
    ],
    jobDemand: 'High',
    averageSalary: '₹3-9 LPA'
  },
  'TypeScript': {
    name: 'TypeScript',
    level: 'Intermediate',
    proficiency: 60,
    description: 'A typed superset of JavaScript that compiles to plain JavaScript.',
    category: 'Programming Language',
    relatedSkills: ['JavaScript', 'React', 'Angular', 'Node.js'],
    learningResources: [
      { title: 'TypeScript Handbook', type: 'Documentation', url: '#' },
      { title: 'TypeScript Course', type: 'Course', url: '#' },
      { title: 'TS Exercises', type: 'Practice', url: '#' }
    ],
    jobDemand: 'High',
    averageSalary: '₹7-15 LPA'
  },
  'Git': {
    name: 'Git',
    level: 'Intermediate',
    proficiency: 70,
    description: 'Distributed version control system for tracking changes in source code.',
    category: 'Development Tool',
    relatedSkills: ['GitHub', 'GitLab', 'Version Control', 'Collaboration'],
    learningResources: [
      { title: 'Git Complete Guide', type: 'Course', url: '#' },
      { title: 'Pro Git Book', type: 'Documentation', url: '#' },
      { title: 'Git Branching', type: 'Practice', url: '#' }
    ],
    jobDemand: 'High',
    averageSalary: '₹4-10 LPA'
  },
  'AWS': {
    name: 'AWS',
    level: 'Beginner',
    proficiency: 40,
    description: 'Amazon Web Services - comprehensive cloud computing platform.',
    category: 'Cloud Platform',
    relatedSkills: ['Docker', 'Kubernetes', 'DevOps', 'Linux'],
    learningResources: [
      { title: 'AWS Certified Solutions Architect', type: 'Course', url: '#' },
      { title: 'AWS Documentation', type: 'Documentation', url: '#' },
      { title: 'AWS Free Tier', type: 'Practice', url: '#' }
    ],
    jobDemand: 'High',
    averageSalary: '₹8-20 LPA'
  }
};

export default function SkillsPage() {
  const { user } = useUser();
  const { firestore } = initializeFirebase();
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  const profileRef = useMemo(() => (user?.uid ? doc(firestore, "users", user.uid) : null), [firestore, user?.uid]);
  const { data: profile } = useDoc<UserProfile>(profileRef);

  const [userSkills, setUserSkills] = useState<SkillDetail[]>([]);
  const [skillCategories, setSkillCategories] = useState<Record<string, SkillDetail[]>>({});

  useEffect(() => {
    if (profile?.skills) {
      // Map user skills to detailed skill information
      const detailedSkills = profile.skills.map(skillName => {
        const normalizedName = skillName.trim();
        return skillsDatabase[normalizedName] || {
          name: normalizedName,
          level: 'Beginner' as const,
          proficiency: 30,
          description: `${normalizedName} is a valuable skill in the tech industry.`,
          category: 'General',
          relatedSkills: [],
          learningResources: [
            { title: `Learn ${normalizedName}`, type: 'Course' as const, url: '#' }
          ],
          jobDemand: 'Medium' as const,
          averageSalary: '₹4-8 LPA'
        };
      });

      setUserSkills(detailedSkills);

      // Group skills by category
      const categories = detailedSkills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, SkillDetail[]>);

      setSkillCategories(categories);
    }
    setLoading(false);
  }, [profile]);

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const averageProficiency = userSkills.length > 0 
    ? Math.round(userSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / userSkills.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
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
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-gray-900">Your Skills Portfolio</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your skills from signup, discover growth opportunities, and advance your career
            </p>
          </div>

          {/* Profile Overview */}
          {profile && (
            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="h-6 w-6 text-purple-600" />
                  Skills Overview from Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{userSkills.length}</div>
                    <div className="text-sm text-gray-600">Total Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{averageProficiency}%</div>
                    <div className="text-sm text-gray-600">Avg Proficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{Object.keys(skillCategories).length}</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{profile.goal || 'Not Set'}</div>
                    <div className="text-sm text-gray-600">Career Goal</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <span className="ml-3 text-lg text-muted-foreground">Loading your skills...</span>
                </div>
              </CardContent>
            </Card>
          ) : !profile?.skills || profile.skills.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2">No Skills Found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  It looks like you haven't added any skills to your profile yet. Add skills during signup or update your profile.
                </p>
                <Link href="/auth">
                  <Button size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skills to Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Skills by Category */}
              {Object.entries(skillCategories).map(([category, skills]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Target className="h-6 w-6 text-indigo-600" />
                      {category}
                      <Badge variant="secondary" className="ml-2">
                        {skills.length} skill{skills.length !== 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {skills.map((skill, index) => (
                        <Card key={index} className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{skill.name}</CardTitle>
                              <Badge className={getSkillLevelColor(skill.level)}>
                                {skill.level}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Proficiency Bar */}
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Proficiency</span>
                                <span className="font-medium">{skill.proficiency}%</span>
                              </div>
                              <Progress value={skill.proficiency} className="h-2" />
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {skill.description}
                            </p>

                            {/* Job Demand & Salary */}
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4" />
                                <span className={getDemandColor(skill.jobDemand)}>
                                  {skill.jobDemand} Demand
                                </span>
                              </div>
                              <span className="font-medium text-green-600">
                                {skill.averageSalary}
                              </span>
                            </div>

                            {/* Related Skills */}
                            {skill.relatedSkills.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">Related Skills:</p>
                                <div className="flex flex-wrap gap-1">
                                  {skill.relatedSkills.slice(0, 3).map((relatedSkill, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {relatedSkill}
                                    </Badge>
                                  ))}
                                  {skill.relatedSkills.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{skill.relatedSkills.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Learning Resources */}
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-2">Learning Resources:</p>
                              <div className="space-y-1">
                                {skill.learningResources.slice(0, 2).map((resource, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                    <span className="text-blue-600 hover:underline cursor-pointer">
                                      {resource.title} ({resource.type})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Button */}
                            <Link href={`/skills/${encodeURIComponent(skill.name)}`}>
                              <Button variant="outline" size="sm" className="w-full">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Learn More
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Skill Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-600" />
                    Recommended Skills to Learn
                  </CardTitle>
                  <p className="text-gray-600">Based on your current skills and career goal</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['TypeScript', 'Docker', 'MongoDB', 'GraphQL'].map((skill, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200 text-center hover:shadow-md transition-shadow cursor-pointer">
                        <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                        <p className="font-medium text-yellow-800">{skill}</p>
                        <p className="text-xs text-yellow-600">High Demand</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Link href="/learning-paths">
                  <Button size="lg">
                    <Target className="h-4 w-4 mr-2" />
                    Create Learning Path
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="default" size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat with AI Coach
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Update Skills
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating AI Career Coach Widget */}
      <CareerCoachWidget userId={user?.uid} />
    </DashboardLayout>
  );
}
