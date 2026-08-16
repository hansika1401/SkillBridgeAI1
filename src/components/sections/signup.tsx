"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { analyzeSkillGaps } from "@/app/actions/ai"
import type { AnalyzeSkillGapsOutput } from "@/ai/flows/ai-skill-gap-analysis"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  college: z.string().min(3, "College name is required."),
  skills: z.string().min(10, "Please list some of your skills."),
  goal: z.string().min(10, "Please describe your career goal."),
})

export function Signup() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSkillGapsOutput | null>(null)
  const [learningPath, setLearningPath] = useState<string | null>(null)
  const [enteredSkills, setEnteredSkills] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", email: "", college: "", skills: "", goal: "" },
  })

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsSubmitting(true)
    // Normalize skills -> array
    const skillsArr = data.skills
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 15)
    setEnteredSkills(skillsArr)

    // 1) Analyze skill gaps (GenAI)
    const result = await analyzeSkillGaps({
      profileDescription: `Name: ${data.name}, College: ${data.college}, Skills: ${data.skills}`,
      desiredJob: data.goal,
    })
    setAnalysisResult(result)

    // 2) Generate learning path via our API using entered skills & goal
    try {
      const res = await fetch('/api/ai/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillsArr, goal: data.goal }),
      })
      if (res.ok) {
        const plan = await res.json()
        setLearningPath(plan?.learningPath || null)
      } else {
        throw new Error('plan_api_error')
      }
    } catch {
      // Fallback: basic -> advanced template
      const primary = (skillsArr[0] || 'Foundations').trim()
      const g = data.goal.trim()
      const fallback = `Week 1-2: ${primary} basics, syntax, and tooling\nWeek 3-4: Core concepts + small projects\nWeek 5-6: Intermediate topics related to ${g}\nWeek 7-8: Build 2 portfolio projects aligned with ${g}\nWeek 9-10: Advanced topics + performance + testing\nWeek 11-12: Polish portfolio, mock interviews, resume & LinkedIn`
      setLearningPath(fallback)
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <section id="signup" className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-background animated-gradient -z-10"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl text-primary-foreground dark:text-foreground">
              Your Future Career Starts Here 🚀
            </h2>
            <p className="max-w-[600px] text-primary-foreground/80 dark:text-muted-foreground md:text-xl">
              Sign up now and let our AI build your personalized path to success.
            </p>
          </div>
          <div className="mx-auto max-w-2xl mt-12">
            <Card className="glass-card shadow-2xl glow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-center">Create Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="your.email@university.edu" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="college" render={({ field }) => (
                      <FormItem><FormLabel>College / University</FormLabel><FormControl><Input placeholder="Your University" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="skills" render={({ field }) => (
                      <FormItem><FormLabel>Your Skills</FormLabel><FormControl><Textarea placeholder="e.g., Python, JavaScript, Public Speaking, Project Management" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="goal" render={({ field }) => (
                      <FormItem><FormLabel>Your Career Goal</FormLabel><FormControl><Textarea placeholder="e.g., I want to become a Software Engineer at a tech startup." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex flex-col gap-4">
                      <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Analyzing..." : "Get My Personalized Path"}
                      </Button>
                      <Button asChild variant="outline" size="lg" className="bg-background/80">
                        <Link href="/auth">Sign up with Google</Link>
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <AlertDialog open={!!analysisResult} onOpenChange={() => { setAnalysisResult(null); setLearningPath(null); setEnteredSkills([]); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Your AI-Powered Skill Analysis</AlertDialogTitle>
            <AlertDialogDescription>
              Based on your profile and goals, here's a breakdown of your path forward.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-4 text-sm">
            <h3 className="font-bold mb-2 text-primary">Skill Gaps to Bridge:</h3>
            <ul className="list-disc list-inside mb-4 space-y-1">
              {analysisResult?.skillGaps.map((gap, i) => <li key={`gap-${i}`}>{gap}</li>)}
            </ul>
            <h3 className="font-bold mb-2 text-primary">Recommended Learning Paths:</h3>
            <ul className="list-disc list-inside mb-4 space-y-1">
              {analysisResult?.recommendedLearningPaths.map((path, i) => <li key={`path-${i}`}>{path}</li>)}
            </ul>
            <h3 className="font-bold mb-2 text-primary">Related Skills You Have:</h3>
            <ul className="list-disc list-inside space-y-1">
              {analysisResult?.relatedSkills.map((skill, i) => <li key={`skill-${i}`}>{skill}</li>)}
            </ul>
            {enteredSkills.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2 text-primary">Your Entered Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {enteredSkills.map((s, i) => (
                    <span key={`es-${i}`} className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary border border-primary/20">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {learningPath && (
              <div className="mt-6">
                <h3 className="font-bold mb-2 text-primary">Your Recommended Learning Path:</h3>
                <pre className="whitespace-pre-wrap bg-muted/40 rounded-md p-3 text-xs text-muted-foreground">{learningPath}</pre>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAnalysisResult(null)}>Got it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
