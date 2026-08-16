"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

const mentors = [
  {
    id: "m1",
    name: "Sarah Chen",
    title: "Senior Software Engineer",
    company: "Google",
    image: PlaceHolderImages.find(p => p.id === 'mentor1')
  },
  {
    id: "m2",
    name: "David Lee",
    title: "Product Manager",
    company: "Microsoft",
    image: PlaceHolderImages.find(p => p.id === 'mentor2')
  },
  {
    id: "m3",
    name: "Jessica Rodriguez",
    title: "UX Design Lead",
    company: "Meta",
    image: PlaceHolderImages.find(p => p.id === 'mentor3')
  }
];

export function MentorConnect() {
  const { user } = useUser();
  const router = useRouter();
  const [requested, setRequested] = useState<Record<string, boolean>>({});
  const [viewAllClicked, setViewAllClicked] = useState(false);

  async function onViewAll() {
    if (!user || user.isAnonymous) {
      router.push("/auth");
      return;
    }
    // brief visual feedback then navigate
    setViewAllClicked(true);
    setTimeout(() => router.push("/mentors"), 250);
  }

  async function onConnect(mentorId: string) {
    if (!user || user.isAnonymous) {
      router.push("/auth");
      return;
    }
    try {
      await fetch("/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, mentorId }),
      });
      setRequested((r: Record<string, boolean>) => ({ ...r, [mentorId]: true }));
    } catch {}
  }

  return (
    <section id="mentors" className="bg-secondary/50 dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Learn Directly from Industry Mentors 🧠</h2>
            <p className="text-muted-foreground text-lg">
              Get personalized guidance, career advice, and interview prep from professionals at top tech companies.
            </p>
            <Button
              size="lg"
              onClick={onViewAll}
              className={viewAllClicked ? "ring-2 ring-green-500 animate-pulse" : undefined}
            >
              View All Mentors
            </Button>
          </div>
          <div className="space-y-6">
            {mentors.map((mentor, index) => (
              <Card
                key={index}
                className={`flex items-center gap-4 p-4 glass-card rounded-xl transition-transform transform hover:-translate-x-2 ${requested[mentor.id] ? 'border-green-500/60 shadow-green-500/20 ring-1 ring-green-500/30' : ''}`}
              >
                {mentor.image && (
                  <Image
                    src={mentor.image.imageUrl}
                    alt={mentor.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                    data-ai-hint={mentor.image.imageHint}
                  />
                )}
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{mentor.name}</h3>
                  <p className="text-muted-foreground">{mentor.title} at <span className="font-semibold text-primary">{mentor.company}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  {requested[mentor.id] && (
                    <Badge className="bg-green-600 text-white">Request sent</Badge>
                  )}
                  <Button variant="outline" onClick={() => onConnect(mentor.id)} disabled={!!requested[mentor.id]}>
                    {requested[mentor.id] ? "Requested" : "Connect"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
