"use client";

import { Button } from "@/components/ui/button";
import { Bell, LogOut, User2 } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { initializeFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useDoc } from "@/firebase";

export function TopBar() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { firestore } = initializeFirebase();

  const profileRef = useMemo(() => {
    if (!user?.uid) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user?.uid]);
  const { data: profile } = useDoc<{ name?: string }>(profileRef);

  async function onLogout() {
    if (!auth) return;
    await signOut(auth);
    router.replace("/");
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
        <User2 className="h-4 w-4" />
        <span>{isUserLoading ? "…" : (profile?.name || user?.displayName || user?.email || "Guest")}</span>
      </div>
      <Button variant="outline" size="sm" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </div>
  );
}
