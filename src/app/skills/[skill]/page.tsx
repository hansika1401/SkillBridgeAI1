"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { CreditCard, CheckCircle2, Users, UserCheck, GraduationCap, Star } from "lucide-react";
import { getFirestore, collection, getDocs, query, where, limit } from "firebase/firestore";
import { initializeFirebase, useUser } from "@/firebase";

const courseBySkill: Record<string, { id: string; title: string; price: number; description: string }> = {
  Python: { id: "python_placement", title: "Python Career Accelerator (100% Placement)", price: 4599, description: "Master Python with projects and interview prep." },
  Cloud: { id: "cloud_placement", title: "Cloud Engineer Bootcamp (100% Placement)", price: 5299, description: "Hands-on AWS/GCP labs and DevOps." },
  "UI/UX": { id: "uiux_placement", title: "UI/UX Designer Pro Track (100% Placement)", price: 4899, description: "Design systems, Figma, portfolio, mentor reviews." },
  "Data Analyst": { id: "data_analyst_placement", title: "Data Analyst FastTrack (100% Placement)", price: 5499, description: "SQL, BI tools, and case interviews." },
  "AI/ML": { id: "placement_100", title: "AI/ML Foundations (100% Placement Support)", price: 4999, description: "ML concepts, projects, and interviews." },
};

export default function SkillDashboardPage() {
  const params = useParams();
  const skill = decodeURIComponent(String(params?.skill || "")).replace(/\+/g, " ");
  const course = courseBySkill[skill] || { id: "placement_100", title: `${skill} Career Track (100% Placement)`, price: 4999, description: `Job-ready ${skill} curriculum with mentor support.` };
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const { firestore } = useMemo(() => initializeFirebase(), []);
  const db = useMemo(() => getFirestore(), []);

  const [studentsCount, setStudentsCount] = useState<number | null>(null);
  const [mentors, setMentors] = useState<any[]>([]);
  const demoStudents: Array<{ name: string; review: string }> = [
    { name: "Aryan Sharma", review: "Cracked my first interview in 3 weeks. Loved the mentor support!" },
    { name: "Neha Verma", review: "Clear roadmap and practical projects. Highly recommend." },
    { name: "Rohit Gupta", review: "The mock interviews were a game changer for me." },
    { name: "Sneha Iyer", review: "Great pacing and real-world assignments. Built confidence fast." },
    { name: "Kunal Mehta", review: "Got my internship converted to PPO with the guidance here." },
  ];
  const demoMentors: Array<{ id: string; name: string; skills?: string[]; experience?: string }> = [
    { id: "m1", name: "Sarah Chen", skills: ["Python", "Data"], experience: "7 yrs @ FAANG" },
    { id: "m2", name: "David Lee", skills: ["Cloud", "DevOps"], experience: "8 yrs @ AWS" },
    { id: "m3", name: "Priya Nair", skills: ["UI/UX", "Product"], experience: "6 yrs @ Fintech" },
    { id: "m4", name: "Arjun Rao", skills: ["AI/ML", "MLOps"], experience: "9 yrs @ Startup" },
    { id: "m5", name: "Emily White", skills: ["Analytics", "BI"], experience: "10 yrs @ Consulting" },
  ];
  const [open, setOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [mentorsOpen, setMentorsOpen] = useState(false);

  // Different ratings per course (out of 5)
  const courseRatings: Record<string, number> = {
    python_placement: 4.6,
    cloud_placement: 4.8,
    uiux_placement: 4.7,
    data_analyst_placement: 4.9,
    placement_100: 4.5,
  };
  const rating = courseRatings[course.id] ?? 4.6;
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const totalStars = 5;

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        // Students joined for this skill (count via simple query + length; for large, use Cloud Function/aggregation)
        const studentsSnap = await getDocs(query(collection(db, "students"), where("skills", "array-contains", skill)));
        if (!ignore) setStudentsCount(studentsSnap.size);
        // Mentors for this skill (top 3)
        const mentorsSnap = await getDocs(query(collection(db, "mentors"), where("skills", "array-contains", skill), limit(20)));
        if (!ignore) setMentors(mentorsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      } catch (e) {
        if (!ignore) {
          setStudentsCount(0);
          setMentors([]);
        }
      }
    }
    load();
    return () => { ignore = true };
  }, [db, skill]);

  async function onPay() {
    if (!user || user.isAnonymous) { router.replace("/auth"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, courseId: course.id, amount: course.price, card })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Payment failed");
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        // After purchase, go back to main dashboard where My Courses will show it
        router.replace("/dashboard");
      }, 1500);
    } catch (e: any) {
      setError(e?.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-headline text-3xl md:text-4xl">{skill} — Skill Dashboard</h1>
        <p className="text-muted-foreground mt-1">Explore peers, mentors, and kickstart your {skill} journey.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Students Joined</CardTitle>
            <Dialog.Root open={studentsOpen} onOpenChange={setStudentsOpen}>
              <Dialog.Trigger asChild>
                <button aria-label="View all students" className="rounded-full p-1.5 hover:bg-white/10 transition">
                  <Users className="h-5 w-5" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
                  <Dialog.Title className="text-xl font-semibold mb-2">All students ({studentsCount === null ? '2000+' : `${Math.max(2000, studentsCount)}+`})</Dialog.Title>
                  <p className="text-sm text-muted-foreground mb-4">Showing sample of 2000+ learners with their reviews.</p>
                  <div className="max-h-[65vh] overflow-y-auto grid gap-2 sm:grid-cols-2">
                    {Array.from({ length: 2000 }).map((_, i) => {
                      const base = demoStudents[i % demoStudents.length]
                      const name = `${base.name.split(' ')[0]} ${base.name.split(' ')[1] || ''}`.trim() + ` #${i+1}`
                      const review = base.review
                      return (
                        <div key={i} className="rounded border p-3">
                          <div className="font-medium">{name}</div>
                          <div className="text-xs text-muted-foreground mt-1">“{review}”</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Dialog.Close asChild>
                      <Button variant="outline">Close</Button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </CardHeader>
          <CardContent>
            <div className="text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none">{studentsCount === null ? "2000+" : `${Math.max(2000, studentsCount)}+`}</div>
            <div className="mt-5 flex items-center gap-5">
              <div className="flex items-center">
                {Array.from({ length: fullStars }).map((_, i) => (
                  <Star key={`sfull-${i}`} className="h-9 w-9 md:h-10 md:w-10 text-yellow-400 fill-yellow-400" />
                ))}
                {halfStar && <Star className="h-9 w-9 md:h-10 md:w-10 text-yellow-400" />}
                {Array.from({ length: totalStars - fullStars - (halfStar ? 1 : 0) }).map((_, i) => (
                  <Star key={`sempty-${i}`} className="h-9 w-9 md:h-10 md:w-10 text-gray-400" />
                ))}
              </div>
              <div className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-semibold">{rating.toFixed(1)} / 5.0</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Top Mentors <span className="text-xs text-muted-foreground">(20+ available)</span></CardTitle>
            <Dialog.Root open={mentorsOpen} onOpenChange={setMentorsOpen}>
              <Dialog.Trigger asChild>
                <button aria-label="View all mentors" className="rounded-full p-1.5 hover:bg-white/10 transition">
                  <UserCheck className="h-5 w-5" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
                  <Dialog.Title className="text-xl font-semibold mb-2">All mentors (20+)</Dialog.Title>
                  <p className="text-sm text-muted-foreground mb-4">Showing a selection of mentors available for this skill.</p>
                  <div className="max-h-[65vh] overflow-y-auto grid gap-2 sm:grid-cols-2">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const arr = mentors.length > 0 ? mentors : demoMentors
                      const base = arr[i % arr.length]
                      return (
                        <div key={i} className="rounded border p-3">
                          <div className="font-medium">{base.name || 'Mentor'} {mentors.length === 0 ? `#${i+1}` : ''}</div>
                          <div className="text-xs text-muted-foreground">{Array.isArray(base.skills) ? base.skills.join(', ') : ''}</div>
                          <div className="text-xs mt-1">Experience: {base.experience || '–'}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Dialog.Close asChild>
                      <Button variant="outline">Close</Button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {(mentors.length > 0 ? mentors.slice(0,5) : demoMentors).map(m => (
                <div key={m.id} className="rounded border p-3">
                  <div className="font-medium">{m.name || "Mentor"}</div>
                  <div className="text-xs text-muted-foreground">{Array.isArray(m.skills) ? m.skills.join(", ") : ""}</div>
                  <div className="text-xs mt-1">Experience: {m.experience || "–"}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student reviews */}
      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="text-lg">What students say</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {demoStudents.map((s, idx) => (
              <div key={idx} className="rounded border p-3">
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-1">“{s.review}”</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      <Card className="glass-card mt-6">
        <CardHeader className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">₹{course.price.toLocaleString()}</div>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Button onClick={() => { if (isUserLoading) return; if (!user || user.isAnonymous) { router.replace("/auth"); return; } setOpen(true); }}>Buy Now</Button>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
                  <Dialog.Title className="mb-4 flex items-center gap-2 text-lg font-medium">
                    <CreditCard className="h-5 w-5"/> Payment Details
                  </Dialog.Title>
                  {success ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <CheckCircle2 className="h-14 w-14 text-green-500" />
                      <div className="mt-2 text-lg font-semibold">Payment Successful</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Input placeholder="Card Number" value={card.number} onChange={e => setCard(v => ({ ...v, number: e.target.value }))} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="MM/YY" value={card.expiry} onChange={e => setCard(v => ({ ...v, expiry: e.target.value }))} />
                        <Input placeholder="CVV" value={card.cvv} onChange={e => setCard(v => ({ ...v, cvv: e.target.value }))} />
                      </div>
                      {error && <div className="text-sm text-red-500">{error}</div>}
                      <div className="flex justify-end gap-2 pt-2">
                        <Dialog.Close asChild>
                          <Button variant="ghost">Cancel</Button>
                        </Dialog.Close>
                        <Button onClick={onPay} disabled={submitting}>{submitting ? "Processing..." : `Pay ₹${course.price.toLocaleString()}`}</Button>
                      </div>
                    </div>
                  )}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4"/> 100% Placement Support • Mentor-led • Real projects</div>
        </CardContent>
      </Card>
    </div>
  );
}
