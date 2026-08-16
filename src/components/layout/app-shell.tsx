"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const HIDE_HEADER_FOOTER_ROUTES = [
  "/dashboard",
  "/chat",
  "/resume-radar",
  "/learning-paths",
  "/mentors",
  "/skills",
  "/settings",
  "/auth",
  "/signup",
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSiteHeaderFooter = HIDE_HEADER_FOOTER_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(route + "/")
  );

  if (hideSiteHeaderFooter) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
