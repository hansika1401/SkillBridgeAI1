"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";

export function Connections() {
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState<any[]>([]);
  const [summary, setSummary] = useState<{ mentors: number; students: number; companies: number } | null>(null);
  const [open, setOpen] = useState<null | "mentors" | "students" | "companies">(null);
  const [connectedMentors, setConnectedMentors] = useState<Record<string, boolean>>({});
  const [connectedStudents, setConnectedStudents] = useState<Record<string, boolean>>({});
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submittingResume, setSubmittingResume] = useState(false);
  const [submittedResume, setSubmittedResume] = useState(false);
  const [seatsOpen, setSeatsOpen] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [mRes, sRes] = await Promise.all([
          fetch('/api/mentors'),
          fetch('/api/connections/summary'),
        ]);
        const mData = await mRes.json();
        const sData = await sRes.json();
        if (!ignore) {
          setMentors(mData?.mentors || []);
          if (sRes.ok) setSummary(sData);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true };
  }, []);

  // Static counts (as requested)
  const staticCounts = { mentors: "200+", students: "5000+", companies: "10000+" } as const;
  const students = staticCounts.students;
  const companies = staticCounts.companies;

  const demoStudents = useMemo(() => ([
    { id: "s1", name: "Isha Verma", course: "Data Science" },
    { id: "s2", name: "Arjun Mehta", course: "Cybersecurity" },
    { id: "s3", name: "Kabir Singh", course: "AI/ML" },
  ]), []);

  const demoCompanies = useMemo(() => ([
    "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Tesla"
  ]), []);

  function getCompanyDetails(name: string) {
    const features = [
      "Mentor-led onboarding",
      "Cutting-edge projects",
      "Flexible hybrid policy",
      "Upskilling budget",
      "Fast interview cycle",
    ];
    const people = Array.from({ length: 6 }, (_, i) => ({
      name: `${name} Team Member ${i + 1}`,
      role: ["SWE", "Data Analyst", "PM", "Designer"][i % 4],
    }));
    return { features, people };
  }

  return (
    <section className="container mx-auto px-4 md:px-6 py-8">
      <h2 className="font-headline text-2xl mb-4">Your Connections</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader><CardTitle>Mentor Network</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{staticCounts.mentors}</div>
            <p className="text-sm text-muted-foreground">Experts available to guide you</p>
            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={() => setOpen("mentors")}>Connect Mentors</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle>Student Community</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students}</div>
            <p className="text-sm text-muted-foreground">Peers in your learning circle</p>
            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={() => setOpen("students")}>Connect Students</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle>Partner Companies Network</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{companies}</div>
            <p className="text-sm text-muted-foreground">Potential recruiters</p>
            <div className="mt-3">
              <Button size="sm" variant="secondary" onClick={() => { setOpen("companies"); setSelectedCompany(null); setResumeFile(null); setSubmittedResume(false); setSeatsOpen(null); }}>Partner Companies</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Removed mentors list section as requested */}

      <Dialog.Root open={open !== null} onOpenChange={(o) => { if (!o) setOpen(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
            {open === "mentors" && (
              <>
                <Dialog.Title className="text-xl font-semibold mb-3">Connect Mentors</Dialog.Title>
                <div className="space-y-3">
                  {(() => {
                    const list = mentors.length > 0 ? mentors : [
                      { id: 'm1', name: 'Aisha Khan', skills: ['Full-Stack','React','Node'] },
                      { id: 'm2', name: 'Ravi Patel', skills: ['Data Science','Python','SQL'] },
                      { id: 'm3', name: 'Neeraj Verma', skills: ['DevOps','Docker','AWS'] },
                    ];
                    return list.map((m: any, idx: number) => {
                      const key = m.id ?? `${m.name ?? 'mentor'}-${idx}`;
                      const isConnected = !!connectedMentors[key];
                      return (
                        <div key={key} className={`flex items-center justify-between rounded-lg border p-3 ${isConnected ? 'bg-primary/10 border-primary' : ''}`}>
                          <div>
                            <div className="font-medium">{m.name || 'Mentor'}</div>
                            <div className="text-xs text-muted-foreground">{(m.skills || []).slice(0,4).join(', ')}</div>
                          </div>
                          <Button size="sm" onClick={() => setConnectedMentors(prev => ({ ...prev, [key]: true }))} disabled={isConnected}>
                            {isConnected ? 'Connected' : 'Connect'}
                          </Button>
                        </div>
                      );
                    });
                  })()}
                </div>
                <div className="mt-4 flex justify-end"><Dialog.Close asChild><Button variant="outline">Close</Button></Dialog.Close></div>
              </>
            )}
            {open === "students" && (
              <>
                <Dialog.Title className="text-xl font-semibold mb-3">Connect Students</Dialog.Title>
                <div className="space-y-3">
                  {demoStudents.map(s => (
                    <div key={s.id} className={`flex items-center justify-between rounded-lg border p-3 ${connectedStudents[s.id] ? 'bg-primary/10 border-primary' : ''}`}>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.course}</div>
                      </div>
                      <Button size="sm" onClick={() => setConnectedStudents(prev => ({ ...prev, [s.id]: true }))} disabled={!!connectedStudents[s.id]}>
                        {connectedStudents[s.id] ? 'Connected' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end"><Dialog.Close asChild><Button variant="outline">Close</Button></Dialog.Close></div>
              </>
            )}
            {open === "companies" && (
              <>
                {!selectedCompany ? (
                  <>
                    <Dialog.Title className="text-xl font-semibold mb-3">Partner Companies</Dialog.Title>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {demoCompanies.map((c, i) => (
                        <button key={i} className="rounded-lg border p-3 text-left font-medium hover:bg-muted transition" onClick={() => { setSelectedCompany(c); setSubmittedResume(false); setResumeFile(null); setSeatsOpen(null); }}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <Dialog.Title className="text-xl font-semibold mb-1">{selectedCompany}</Dialog.Title>
                    <p className="text-sm text-muted-foreground mb-4">Apply directly with your resume (PDF).</p>
                    <div className="mb-4">
                      <div className="font-medium mb-2">Key features</div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {getCompanyDetails(selectedCompany).features.map((f, idx) => (<li key={idx}>{f}</li>))}
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
                        <input id="resumeUploadConn" type="file" accept="application/pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                        <label htmlFor="resumeUploadConn">
                          <Button variant="outline" asChild><span>{resumeFile ? 'Change file' : 'Choose PDF'}</span></Button>
                        </label>
                        <div className="text-sm text-muted-foreground">{resumeFile ? resumeFile.name : 'No file selected'}</div>
                        <Button
                          onClick={async () => {
                            if (!resumeFile) return;
                            setSubmittingResume(true);
                            await new Promise(r => setTimeout(r, 900));
                            setSubmittingResume(false);
                            setSubmittedResume(true);
                            const seats = Math.max(5, Math.floor(Math.random() * 50));
                            setSeatsOpen(seats);
                          }}
                          disabled={!resumeFile || submittingResume}
                        >
                          {submittingResume ? 'Submitting...' : submittedResume ? 'Submitted' : 'Submit'}
                        </Button>
                      </div>
                      {submittedResume && (
                        <div className="mt-3 rounded-md border bg-muted p-3 text-sm">
                          <div className="font-medium">Application received.</div>
                          <div className="text-muted-foreground">{seatsOpen !== null ? `${seatsOpen} seats are currently open.` : 'Fetching seats...'}</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="ghost" onClick={() => setSelectedCompany(null)}>Back to companies</Button>
                      <Dialog.Close asChild><Button variant="outline">Close</Button></Dialog.Close>
                    </div>
                  </>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
