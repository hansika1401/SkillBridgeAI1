"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { IconPython, IconReact, IconSQL } from "../icons";
import { Badge } from "../ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Lightbulb, BookOpen } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { useUser } from "@/firebase";
import Link from "next/link";

export function DashboardPreview() {
  const dashboardImage = PlaceHolderImages.find(p => p.id === 'dashboard-mockup');
  const [open, setOpen] = useState<null | "courses" | "ideas" | "skills">(null);
  const { user } = useUser();

  const courses = useMemo(() => Array.from({ length: 1200 }, (_, i) => ({
    id: `c${i+1}`,
    title: `${i % 2 === 0 ? "Advanced" : "Beginner to Pro"} ${["Python", "React", "Node.js", "Data Science", "AI/ML", "Cloud", "DevOps", "Cybersecurity", "Product", "UI/UX"][i % 10]} ${i % 3 === 0 ? "Mastery" : "Bootcamp"}`,
  })), []);
  const top5Courses = courses.slice(0, 5);

  const ideas = useMemo(() => Array.from({ length: 1100 }, (_, i) => ({
    id: `p${i+1}`,
    title: `${["Smart", "AI-powered", "Intelligent", "Predictive", "Generative"][i % 5]} ${["Resume Ranker", "Stock Forecaster", "Health Assistant", "Chatbot", "Recommender", "Fraud Detector"][i % 6]}`,
  })), []);
  const top5Ideas = ideas.slice(0, 5);

  const skills = useMemo(() => Array.from({ length: 60 }, (_, i) => (
    ["Python","JavaScript","TypeScript","React","Next.js","Node.js","SQL","NoSQL","Data Structures","Algorithms","Git","Docker","Kubernetes","AWS","GCP","Azure","CI/CD","Jest","Cypress","Playwright","HTML","CSS","Tailwind","Redux","GraphQL","REST","gRPC","Linux","Terraform","Ansible","Communication","Problem Solving","System Design","Networking","Security","Figma","UI/UX","Analytics","Pandas","NumPy","TensorFlow","PyTorch","Scikit-learn","LangChain","RAG","Prompt Engineering","OpenAI APIs","Firebase","Firestore","Auth","Stripe","Testing"][i % 50]
  )), []);
  const fewSkills = skills.slice(0, 8);

  // Preview subsets (20 items) shown inside cards
  const previewCourses = courses.slice(0, 20);
  const previewIdeas = ideas.slice(0, 20);
  const previewSkills = skills.slice(0, 20);

  return (
    <section id="features" className="bg-gray-900 text-white dark:bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <h2 className="text-5xl font-bold font-headline tracking-tighter sm:text-7xl">Your Smart Dashboard — Powered by AI</h2>
          <p className="max-w-[1100px] text-gray-300 md:text-2xl/relaxed">
            All your career-building tools in one place. Track progress, find resources, and get AI-driven insights.
          </p>
        </div>

        <div className="relative">
          {/* Floating Icons */}
          <IconPython className="absolute -top-10 -left-10 h-16 w-16 text-blue-400 opacity-20 animate-pulse" />
          <IconReact className="absolute -bottom-16 right-0 h-20 w-20 text-cyan-400 opacity-20 animate-spin-slow" />
          <IconSQL className="absolute top-1/2 -right-16 h-14 w-14 text-purple-400 opacity-20 animate-pulse delay-500" />
          
          <Card className="glass-card border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden">
            {dashboardImage && (
              <Image
                src={dashboardImage.imageUrl}
                alt={dashboardImage.description}
                width={1200}
                height={800}
                className="w-full h-auto"
                data-ai-hint={dashboardImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-black/20 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 p-8 lg:p-14">
                <Card role="button" tabIndex={0} onClick={() => setOpen("courses")} className="glass-card bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer min-h-[560px]">
                    <CardHeader className="flex-row items-center gap-5 space-y-0 pb-3">
                        <div className="p-3 bg-primary/20 rounded-md"><BookOpen className="h-8 w-8 text-primary"/></div>
                        <CardTitle className="text-xl font-headline text-white">Recommended Courses</CardTitle>
                    </CardHeader>
                    <CardContent className="text-[13px] text-gray-100">
                      <div className="pr-2 space-y-1.5">
                        {previewCourses.map(c => (
                          <p key={c.id}>{c.title}</p>
                        ))}
                      </div>
                    </CardContent>
                </Card>
                <Card role="button" tabIndex={0} onClick={() => setOpen("ideas")} className="glass-card bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer min-h-[560px]">
                    <CardHeader className="flex-row items-center gap-5 space-y-0 pb-3">
                         <div className="p-3 bg-accent/20 rounded-md"><Lightbulb className="h-8 w-8 text-accent"/></div>
                        <CardTitle className="text-xl font-headline text-white">AI Project Ideas</CardTitle>
                    </CardHeader>
                    <CardContent className="text-[13px] text-gray-100">
                      <div className="pr-2 space-y-1.5">
                        {previewIdeas.map(i => (
                          <p key={i.id}>{i.title}</p>
                        ))}
                      </div>
                    </CardContent>
                </Card>
                 <Card role="button" tabIndex={0} onClick={() => setOpen("skills")} className="glass-card bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer min-h-[560px]">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-headline text-white">Your Skill Graph</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="pr-2">
                        <div className="flex flex-wrap gap-2">
                          {previewSkills.map((s, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-white/20 border-white/10 text-white">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                </Card>
            </div>
          </Card>
        </div>
      </div>
      <Dialog.Root open={open !== null} onOpenChange={(o) => { if (!o) setOpen(null) }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
            {open === "courses" && (
              <>
                <Dialog.Title className="text-xl font-semibold mb-2">Recommended Courses (100% Placement Guarantee)</Dialog.Title>
                <p className="text-sm text-muted-foreground mb-4">{user && !user.isAnonymous ? "Showing 1200+ curated courses." : "Showing 20 top picks. Sign up to see all 1000+ courses."}</p>
                <div className="max-h-[60vh] overflow-y-auto space-y-2">
                  {(user && !user.isAnonymous ? courses : previewCourses).map(c => (
                    <div key={c.id} className="rounded border p-2 text-sm">{c.title}</div>
                  ))}
                </div>
                {(!user || user.isAnonymous) && (
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">Sign up or log in to see all courses.</div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="default"><Link href="/auth">Sign up</Link></Button>
                      <Button asChild size="sm" variant="outline"><Link href="/auth">Log in</Link></Button>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <Dialog.Close asChild>
                    <Button variant="outline">Close</Button>
                  </Dialog.Close>
                </div>
              </>
            )}
            {open === "ideas" && (
              <>
                <Dialog.Title className="text-xl font-semibold mb-2">AI Project Ideas</Dialog.Title>
                <p className="text-sm text-muted-foreground mb-4">{user && !user.isAnonymous ? "Over 1000 ideas to build your portfolio." : "Showing 20 ideas. Sign up to see 1000+ ideas."}</p>
                <div className="max-h-[60vh] overflow-y-auto space-y-2">
                  {(user && !user.isAnonymous ? ideas : previewIdeas).map(i => (
                    <div key={i.id} className="rounded border p-2 text-sm">{i.title}</div>
                  ))}
                </div>
                {(!user || user.isAnonymous) && (
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">Sign up or log in to see all ideas.</div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="default"><Link href="/auth">Sign up</Link></Button>
                      <Button asChild size="sm" variant="outline"><Link href="/auth">Log in</Link></Button>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <Dialog.Close asChild>
                    <Button variant="outline">Close</Button>
                  </Dialog.Close>
                </div>
              </>
            )}
            {open === "skills" && (
              <>
                <Dialog.Title className="text-xl font-semibold mb-2">Skills (50+)</Dialog.Title>
                <div className="max-h-[60vh] overflow-y-auto gap-2 grid grid-cols-2 sm:grid-cols-3">
                  {(user && !user.isAnonymous ? skills : previewSkills).map((s, idx) => (
                    <div key={idx} className="rounded border px-2 py-1 text-sm">{s}</div>
                  ))}
                </div>
                {(!user || user.isAnonymous) && (
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">Sign up or log in to see all skills.</div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="default"><Link href="/auth">Sign up</Link></Button>
                      <Button asChild size="sm" variant="outline"><Link href="/auth">Log in</Link></Button>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <Dialog.Close asChild>
                    <Button variant="outline">Close</Button>
                  </Dialog.Close>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
