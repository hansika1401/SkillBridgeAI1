"use client"

import { useState } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const Schema = z.object({
  name: z.string().min(2),
  mobile: z.string().min(8),
  degree: z.string().min(2),
  college: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  skills: z.string().optional(),
  goal: z.string().optional()
}).refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] })

type FormValues = z.infer<typeof Schema>

export default function SignUpPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      mobile: "",
      degree: "",
      college: "",
      email: "",
      password: "",
      confirmPassword: "",
      skills: "",
      goal: "",
    },
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          skills: (values.skills || '').split(',').map(s => s.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Failed to sign up")
        return
      }
      setSuccess("Account created successfully.")
      form.reset()
    } catch (e: any) {
      setError(e?.message || "Network error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-[80vh] w-full flex items-center justify-center px-4 py-10 bg-secondary/40 dark:bg-background">
      <Card className={cn("w-full max-w-xl rounded-xl shadow-lg")}> 
        <CardContent className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">Create your account</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="mobile" render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <Input placeholder="Mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="degree" render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <Input placeholder="Degree" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="college" render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <Input placeholder="College name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <Input type="password" placeholder="Confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="skills" render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormControl>
                    <Input placeholder="Your skills (e.g., JavaScript, Python, React)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="goal" render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormControl>
                    <Input placeholder="Career goal (e.g., Frontend Developer, Data Scientist)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {error && <div className="col-span-1 md:col-span-2 text-sm text-red-600">{error}</div>}
              {success && <div className="col-span-1 md:col-span-2 text-sm text-green-600">{success}</div>}

              <div className="col-span-1 md:col-span-2 mt-2 flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create account"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  )
}
