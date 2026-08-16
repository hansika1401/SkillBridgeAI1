"use client"

import { Briefcase, School, Bot, Linkedin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedNumber } from "@/components/ui/animated-number"
import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { useUser } from "@/firebase"
import Link from "next/link"

const problemCards = [
  {
    icon: <School className="h-10 w-10 text-primary" />,
    title: "Students",
    description: "Learn theory in college but often lack the practical, real-world skills that companies demand.",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Companies",
    description: "Struggle to find entry-level talent that is already trained and ready to contribute from day one.",
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: "SkillBridge AI",
    description: "Our AI platform analyzes your profile and connects you to a personalized learning path to bridge that gap.",
  },
]

export function ProblemMission() {
  const [open, setOpen] = useState<null | "students" | "companies">(null)
  const [connected, setConnected] = useState<Record<string, boolean>>({})
  const { user, isUserLoading } = useUser()
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [submittingResume, setSubmittingResume] = useState(false)
  const [submittedResume, setSubmittedResume] = useState(false)
  const [seatsOpen, setSeatsOpen] = useState<number | null>(null)

  const students = useMemo(() => (
    [
      { id: "s1", name: "Aarav Sharma", course: "Full-Stack Development" },
      { id: "s2", name: "Isha Verma", course: "Data Science" },
      { id: "s3", name: "Rohan Patel", course: "Cloud & DevOps" },
      { id: "s4", name: "Neha Gupta", course: "UI/UX Design" },
      { id: "s5", name: "Arjun Mehta", course: "Cybersecurity" },
      { id: "s6", name: "Priya Nair", course: "Product Management" },
      { id: "s7", name: "Kabir Singh", course: "AI/ML" },
      { id: "s8", name: "Simran Kaur", course: "Backend Engineering" },
      { id: "s9", name: "Vikram Rao", course: "Mobile Development" },
      { id: "s10", name: "Ananya Iyer", course: "Business Analytics" },
      { id: "s11", name: "Rahul Jain", course: "QA Automation" },
      { id: "s12", name: "Tanvi Desai", course: "Data Engineering" },
    ]
  ), [])

  const companies = useMemo(() => ([
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Meta",
    "Netflix",
    "Tesla",
    "NVIDIA",
    "Adobe",
    "Airbnb",
    "AMD",
    "ASML",
    "Atlassian",
    "ByteDance",
    "Cisco",
    "Cloudflare",
    "Datadog",
    "Dell",
    "DoorDash",
    "Dropbox",
    "eBay",
    "Epic Games",
    "Ericsson",
    "GitHub",
    "GitLab",
    "HubSpot",
    "IBM",
    "Intel",
    "Intuit",
    "Lyft",
    "MongoDB",
    "NIO",
    "OpenAI",
    "Oracle",
    "Palantir",
    "PayPal",
    "Pinterest",
    "Plaid",
    "Qualcomm",
    "Red Hat",
    "Revolut",
    "Roblox",
    "Salesforce",
    "SAP",
    "Shopify",
    "Slack",
    "Snowflake",
    "SpaceX",
    "Spotify",
    "Square (Block)",
    "Stripe",
    "TikTok",
    "Twilio",
    "Twitch",
    "Uber",
    "UiPath",
    "VMware",
    "WhatsApp",
    "Yahoo",
    "Yelp",
    "Zscaler",
    "Zoom",
    "Zillow",
    "Affirm",
    "Airtable",
    "Algolia",
    "Coinbase",
    "Confluent",
    "Cruise",
    "Databricks",
    "Doordash",
    "Elastic",
    "Figma",
    "Gusto",
    "Hike",
    "JetBrains",
    "Klarna",
    "Lattice",
    "Miro",
    "Notion",
    "Nutanix",
    "Opendoor",
    "Pinterest",
    "Postman",
    "Ramp",
    "Razorpay",
    "Rippling",
    "Robinhood",
    "Segment",
    "ServiceNow",
    "Skyscanner",
    "Snap",
    "Snyk",
    "Soroco",
    "Splunk",
    "Squarespace",
    "Superhuman",
    "Swiggy",
    "Tanium",
    "Tempus",
    "Toast",
    "Truly",
    "Turo",
    "Upwork",
    "Yuga Labs",
    "Zerodha",
    "Zoho",
    "CRED",
    "PhonePe",
    "Flipkart",
    "Ola",
    "BYJU'S",
    "Meesho",
    "Paytm",
    "Freshworks",
    "InMobi",
    "Dream11",
    "ShareChat",
    "Nykaa",
    "Lenskart",
    "Policybazaar",
    "Zomato",
    "MakeMyTrip",
    "Rivian",
    "Lucid Motors",
    "General Motors (GM)",
    "Ford",
    "Boeing",
    "Northrop Grumman",
    "Lockheed Martin",
    "Siemens",
    "Philips",
    "ABB",
    "Capgemini",
    "Accenture",
    "Deloitte",
    "KPMG",
    "PwC",
    "EY"
  ]), [])

  function getCompanyDetails(name: string) {
    const features = [
      "Mentor-led onboarding",
      "Cutting-edge projects",
      "Flexible hybrid policy",
      "Upskilling budget",
      "Fast interview cycle",
    ]
    const people = Array.from({ length: 6 }, (_, i) => ({
      name: `${name} Team Member ${i + 1}`,
      role: ["SWE", "Data Analyst", "PM", "Designer"][i % 4],
    }))
    return { features, people }
  }

  function onCardClick(title: string) {
    if (title === "Students") {
      setOpen("students")
      return
    }
    if (title === "Companies") {
      setOpen("companies")
      return
    }
    if (title === "SkillBridge AI") {
      const el = document.getElementById("ai-coach")
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  function connect(id: string) {
    setConnected(prev => ({ ...prev, [id]: true }))
  }

  return (
    <section id="problem" className="bg-secondary/50 dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl">The Skill Gap Is Real.</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-2xl/relaxed lg:text-xl/relaxed xl:text-2xl/relaxed">
              Millions of talented graduates are finding it harder than ever to land their first job. Here's why.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12 lg:max-w-none lg:gap-16 mt-12">
          {problemCards.map((card, index) => (
            <Card
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => onCardClick(card.title)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onCardClick(card.title) }}
              className="glass-card rounded-xl transition-all duration-300 hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
            >
              <CardHeader className="flex flex-col items-center text-center gap-4">
                {card.icon}
                <CardTitle className="font-headline text-3xl">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground text-lg">
                {card.description}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
            <p className="font-headline text-5xl font-bold text-primary">
              <AnimatedNumber value={82} />%
            </p>
            <p className="text-muted-foreground text-xl">of graduates feel they lack industry-ready skills.</p>
        </div>
      </div>

      <Dialog.Root open={open !== null} onOpenChange={(o) => { if (!o) setOpen(null) }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
            {open === "students" && (
              <>
                <Dialog.Title className="text-2xl font-semibold mb-3">Students {(!isUserLoading && user && !user.isAnonymous) ? `(${students.length})` : "(Top Picks)"}</Dialog.Title>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {(user && !user.isAnonymous ? students : students.slice(0, 6)).map(s => (
                    <div
                      key={s.id}
                      className={`flex items-center justify-between rounded-lg border p-3 transition-colors transition-shadow ${connected[s.id] ? 'bg-primary/10 border-primary ring-2 ring-primary/40 shadow-md' : ''}`}
                    >
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-muted-foreground">{s.course}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => connect(s.id)} disabled={!!connected[s.id]}>
                          {connected[s.id] ? "Connected" : "Make connection"}
                        </Button>
                        <Button size="icon" variant="outline" asChild>
                          <Link href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {(!user || user.isAnonymous) && (
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">Sign up or log in to see all students in detail.</div>
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
            {open === "companies" && (
              <>
                {!selectedCompany ? (
                  <>
                    <Dialog.Title className="text-2xl font-semibold mb-3">Companies hiring (100+)</Dialog.Title>
                    <p className="text-sm text-muted-foreground mb-4">Here are some of the top companies:</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(user && !user.isAnonymous ? companies : companies.slice(0, 12)).map((c, i) => (
                        <button
                          key={i}
                          className="rounded-lg border p-3 text-left font-medium hover:bg-muted transition"
                          onClick={() => { setSelectedCompany(c); setSubmittedResume(false); setSeatsOpen(null); setResumeFile(null); }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    {(!user || user.isAnonymous) && (
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="text-sm text-muted-foreground">Sign up or log in to see the full list of 100+ companies.</div>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="default"><Link href="/auth">Sign up</Link></Button>
                          <Button asChild size="sm" variant="outline"><Link href="/auth">Log in</Link></Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Dialog.Title className="text-2xl font-semibold mb-1">{selectedCompany}</Dialog.Title>
                    <p className="text-sm text-muted-foreground mb-4">Explore the company and apply directly with your resume (PDF).</p>

                    <div className="mb-4">
                      <div className="font-medium mb-2">Key features</div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {getCompanyDetails(selectedCompany).features.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <div className="font-medium mb-2">People working here</div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {getCompanyDetails(selectedCompany).people.map((p, idx) => (
                          <div key={idx} className="rounded-lg border p-3">
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.role}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="font-medium mb-2">Send your resume (PDF)</div>
                      <div className="flex items-center gap-3">
                        <input
                          id="resumeUpload"
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => setResumeFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                        />
                        <label htmlFor="resumeUpload">
                          <Button variant="outline" asChild>
                            <span>{resumeFile ? "Change file" : "Choose PDF"}</span>
                          </Button>
                        </label>
                        <div className="text-sm text-muted-foreground">
                          {resumeFile ? resumeFile.name : "No file selected"}
                        </div>
                        <Button
                          onClick={async () => {
                            if (!resumeFile) return;
                            setSubmittingResume(true)
                            // Simulate upload + application submission
                            await new Promise(r => setTimeout(r, 900))
                            setSubmittingResume(false)
                            setSubmittedResume(true)
                            // Simulate fetching seats open
                            const seats = Math.max(5, Math.floor(Math.random() * 50))
                            setSeatsOpen(seats)
                          }}
                          disabled={!resumeFile || submittingResume}
                        >
                          {submittingResume ? "Submitting..." : submittedResume ? "Submitted" : "Submit"}
                        </Button>
                      </div>
                      {submittedResume && (
                        <div className="mt-3 rounded-md border bg-muted p-3 text-sm">
                          <div className="font-medium">Application received.</div>
                          <div className="text-muted-foreground">{seatsOpen !== null ? `${seatsOpen} seats are currently open.` : "Fetching seats..."}</div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-between">
                      <Button variant="ghost" onClick={() => setSelectedCompany(null)}>Back to companies</Button>
                      <Dialog.Close asChild>
                        <Button variant="outline">Close</Button>
                      </Dialog.Close>
                    </div>
                  </>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}
