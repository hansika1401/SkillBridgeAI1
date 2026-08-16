import "../polyfills/localStorage";
import type { Metadata } from "next";
import { PT_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import CursorGlow from "@/components/ui/cursor-glow";
import { FirebaseClientProvider } from "@/firebase/client-provider";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: "SkillBridge AI",
  description: "Bridge the Gap Between College and Career with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ptSans.variable} ${spaceGrotesk.variable} font-body antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FirebaseClientProvider>
            <CursorGlow />
            <AppShell>{children}</AppShell>
            <Toaster />
            <ScrollToTop />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
