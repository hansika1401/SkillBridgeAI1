"use client";

import { ReactNode } from "react";
import { DashboardNav } from "./DashboardNav";
import { TopBar } from "./TopBar";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarInset,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span>SkillBridge AI</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="flex-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 border-b p-4">
              <SidebarTrigger />
              <div className="flex-1" />
              <TopBar />
            </div>
            <main className="flex-1 pt-0">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
