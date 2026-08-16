"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Bot, User, BrainCircuit } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { aiInteractiveCareerCoach } from "@/app/actions/ai"
import { cn } from "@/lib/utils"
import { Textarea } from "../ui/textarea";

const FormSchema = z.object({
  query: z.string().min(10, {
    message: "Please ask a more detailed question.",
  }),
})

type Message = {
  role: "user" | "assistant" | "thinking"
  content: string
}

export function AiCareerCoach() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask me anything! For example: 'What skills do I need for a Data Analyst role?'" }
  ])


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setMessages((prev) => [...prev, { role: "user", content: data.query }])
    form.reset()
    setMessages((prev) => [...prev, { role: "thinking", content: "..." }])

    try {
      const result = await aiInteractiveCareerCoach({ query: data.query })
      setMessages((prev) => {
        const newMessages = prev.filter(msg => msg.role !== 'thinking')
        return [...newMessages, { role: "assistant", content: result.answer }]
      })
    } catch (e: any) {
      const fallback = "AI is temporarily unavailable. Please try again in a moment."
      setMessages((prev) => {
        const newMessages = prev.filter(msg => msg.role !== 'thinking')
        return [...newMessages, { role: "assistant", content: fallback }]
      })
    }
  }

  return (
    <section id="ai-coach" className="bg-secondary/50 dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Meet Your AI Career Coach 🤖</h2>
            <p className="text-muted-foreground text-lg">
              Get instant, personalized answers to your career questions. Our AI is trained on vast amounts of industry data to provide you with the best advice.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Ask about skills for a specific role.</li>
              <li>Get advice on your resume.</li>
              <li>Find out about salary expectations.</li>
              <li>Explore different career paths.</li>
            </ul>
          </div>
          <Card className="glass-card rounded-xl shadow-lg p-4 h-[500px] flex flex-col">
            <CardContent className="flex-grow overflow-y-auto space-y-4 p-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
                  {message.role !== "user" && <div className="p-2 bg-primary/20 rounded-full text-primary"><Bot /></div>}
                  <div className={cn("rounded-lg px-4 py-2 max-w-[80%]", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    {message.role === "thinking" ? (
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="animate-pulse h-4 w-4" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                  {message.role === "user" && <div className="p-2 bg-secondary rounded-full text-secondary-foreground"><User /></div>}
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Textarea
                            id="ai-query"
                            placeholder="Ask your question..."
                            {...field}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (!form.formState.isSubmitting) {
                                  form.handleSubmit(onSubmit)();
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={form.formState.isSubmitting}>Send</Button>
                </form>
              </Form>
            </div>
          </Card>
          {/* Floating chat helper button */}
          <div
            id="chat-helper-button"
            onClick={() => {
              const el = document.getElementById('ai-query') as HTMLTextAreaElement | null;
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => el.focus(), 300);
              }
            }}
            className="fixed bottom-6 right-6 z-50 flex items-center px-4 py-3 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: 'rgb(20, 39, 68)', color: 'rgb(177, 251, 248)' }}
          >
            <img src="https://www.omnidim.io/logo.png" alt="Chat" className="h-6 w-6 mr-2" />
            <span className="font-bold">Your AI Career Coach 🤖</span>
          </div>
        </div>
      </div>
    </section>
  )
}
