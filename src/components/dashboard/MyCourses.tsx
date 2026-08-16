"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MyCourses() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!user || user.isAnonymous) { setLoading(false); return; }
      try {
        const res = await fetch(`/api/courses/mine?userId=${encodeURIComponent(user.uid)}`);
        const data = await res.json();
        if (!ignore) setCourses(data?.courses || []);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true };
  }, [user]);

  return (
    <section className="container mx-auto px-4 md:px-6 py-8">
      <h2 className="font-headline text-2xl mb-4">My Courses</h2>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="text-sm text-muted-foreground">No purchased courses yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id} className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{c.description}</p>
                <div className="mt-4">
                  <Button>{c.progress > 0 ? "Continue" : "Start"}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
