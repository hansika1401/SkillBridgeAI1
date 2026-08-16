"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Radar, 
  BookOpen, 
  Users, 
  TrendingUp,
  MessageSquare,
  Settings
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "ResumeRadar",
    href: "/resume-radar",
    icon: Radar,
    description: "AI Resume Analyzer"
  },
  {
    title: "Learning Paths",
    href: "/learning-paths",
    icon: BookOpen,
  },
  {
    title: "Mentors",
    href: "/mentors",
    icon: Users,
  },
  {
    title: "Skills",
    href: "/skills",
    icon: TrendingUp,
  },
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 p-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <div className="flex flex-col">
              <span>{item.title}</span>
              {item.description && (
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
