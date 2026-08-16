"use client";
import { DashboardPreview } from "@/components/sections/dashboard-preview";
import { Connections } from "@/components/dashboard/Connections";
import { PlacementCourse } from "@/components/dashboard/PlacementCourse";
import { MyCourses } from "@/components/dashboard/MyCourses";
import { LearningPath } from "@/components/dashboard/LearningPath";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useUser, useDoc, initializeFirebase } from "@/firebase";
import { useMemo } from "react";
import { doc } from "firebase/firestore";

export default function DashboardPage() {
  const { user } = useUser();
  const { firestore } = initializeFirebase();
  const profileRef = useMemo(() => (user?.uid ? doc(firestore, "users", user.uid) : null), [firestore, user?.uid]);
  const { data: profile } = useDoc<{ name?: string }>(profileRef);
  const displayName = profile?.name || user?.displayName || user?.email || "";
  
  return (
    <DashboardLayout>
      <div>
        <section className="container mx-auto px-4 md:px-6 py-6">
          <h1 className="font-headline text-2xl md:text-3xl">{`Welcome back${displayName ? `, ${displayName}` : ''} 👋 Let's continue your journey to 100% placement!`}</h1>
        </section>
        <DashboardPreview />
        <LearningPath />
        <Connections />
        <PlacementCourse />
        <MyCourses />
        {/** Floating coach removed; Omnidimension widget is integrated via AiCareerCoach section on landing */}
      </div>
    </DashboardLayout>
  )
}
