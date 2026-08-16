"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { ThemeToggle } from "../ui/theme-toggle"
import { BrainCircuit, Menu, User } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useUser } from "@/firebase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "firebase/auth"
import { useAuth } from "@/firebase"
import { Skeleton } from "../ui/skeleton"

const navLinks = [
  { href: "/#problem", label: "The Problem" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/#mentors", label: "Mentors" },
  { href: "/#testimonials", label: "Testimonials" },
]

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.replace("/");
    }
  };

  const renderAuthContent = () => {
    if (isUserLoading) {
      return <Skeleton className="h-10 w-24" />;
    }

    if (user && !user.isAnonymous) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Button asChild>
        <Link href="/auth">Get Started</Link>
      </Button>
    )
  }

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-sm border-b"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span>SkillBridge AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {renderAuthContent()}
        </div>
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold" onClick={() => setIsMenuOpen(false)}>
                  <BrainCircuit className="h-6 w-6 text-primary" />
                  <span>SkillBridge AI</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
                 <div className="flex items-center justify-between">
                    <span>Switch Theme</span>
                    <ThemeToggle />
                  </div>
                {isUserLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : user && !user.isAnonymous ? (
                  <div className="flex flex-col gap-2">
                    <Button asChild>
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Go to Dashboard</Link>
                    </Button>
                     <Button variant="outline" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>Sign Out</Button>
                  </div>
                ) : (
                  <Button asChild>
                    <Link href="/auth" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
