"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Mentor = { id: string; name: string; title: string; company: string };

function useMockMentors(total = 20000) {
  const titles = [
    "Software Engineer",
    "Senior Software Engineer",
    "Product Manager",
    "Data Scientist",
    "UX Designer",
    "DevOps Engineer",
    "Cloud Architect",
  ];
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Netflix",
    "Tesla",
    "Adobe",
    "Stripe",
    "Uber",
    "Salesforce",
  ];
  const firstNames = [
    "Aarav","Isha","Rohan","Neha","Arjun","Priya","Kabir","Simran","Vikram","Ananya",
    "Rahul","Tanvi","Akshay","Meera","Kunal","Sana","Ritika","Dev","Ira","Nikhil",
    "Aisha","Raghav","Kiara","Yash","Zara","Aditya","Maya","Ishan","Aditi","Kartik",
    "Anika","Siddharth","Tara","Varun","Ishita","Arnav","Pooja","Ritvik","Shreya","Aman"
  ];
  const lastNames = [
    "Sharma","Verma","Patel","Gupta","Mehta","Nair","Singh","Kaur","Rao","Iyer",
    "Jain","Desai","Kapoor","Malhotra","Chopra","Joshi","Bose","Banerjee","Ghosh","Pillai",
    "Kulkarni","Reddy","Shetty","Menon","Dutta","Bhatt","Trivedi","Agarwal","Khanna","Saxena",
    "Chaudhary","Mahajan","Bhandari","Sethi","Tandon","Nayak","Thakur","Rawat","Goel","Mishra"
  ];
  const initials = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return useMemo<Mentor[]>(() =>
    Array.from({ length: total }, (_, i) => {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[i % lastNames.length];
      const init = initials[i % initials.length];
      return {
        id: `m-${i + 1}`,
        name: `${fn} ${ln} ${init}.`,
        title: titles[i % titles.length],
        company: companies[i % companies.length],
      } as Mentor;
    }),
  [total]);
}

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function MentorsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const mentors = useMockMentors(20000);

  const [page, setPage] = useState(1);
  const pageSize = 50;
  const totalPages = Math.ceil(mentors.length / pageSize);
  const [requested, setRequested] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isUserLoading) return;
    if (!user || user.isAnonymous) router.replace("/auth");
  }, [user, isUserLoading, router]);

  const slice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return mentors.slice(start, start + pageSize);
  }, [page, mentors]);

  async function requestConnection(mentorId: string) {
    if (!user || user.isAnonymous) { router.replace("/auth"); return; }
    if (requested[mentorId]) return;
    try {
      await fetch("/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, mentorId }),
      });
      setRequested((r) => ({ ...r, [mentorId]: true }));
    } catch {}
  }

  return (
    <DashboardLayout>
      <section className="container mx-auto px-4 md:px-6 py-10">
        <h1 className="font-headline text-3xl md:text-4xl mb-2">All Mentors</h1>
        <p className="text-sm text-muted-foreground mb-6">20,000+ mentors available. Page {page} of {totalPages}.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slice.map((m) => (
            <Card key={m.id} className={`glass-card ${requested[m.id] ? 'border-green-500/60 shadow-green-500/20 ring-1 ring-green-500/30' : ''}`}>
              <CardContent className="p-4">
                <div className="font-semibold text-lg">{m.name}</div>
                <div className="text-sm text-muted-foreground">{m.title} at <span className="font-medium">{m.company}</span></div>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    {requested[m.id] && (
                      <Badge className="bg-green-600 text-white">Request sent</Badge>
                    )}
                    <Button size="sm" onClick={() => requestConnection(m.id)} disabled={!!requested[m.id]}>
                      {requested[m.id] ? "Requested" : "Connect"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <div className="text-sm">Page {page} / {totalPages}</div>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      </section>
    </DashboardLayout>
  );
}
