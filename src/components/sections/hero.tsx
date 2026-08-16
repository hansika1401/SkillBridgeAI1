"use client"

import { Button } from "@/components/ui/button"
import { Typewriter } from "@/components/ui/typewriter"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-animation');

  return (
    <section id="hero" className="relative w-full h-screen min-h-[700px] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-background animated-gradient -z-10"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-4 text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl !leading-tight">
              <Typewriter
                text="Bridge the Gap Between College and Career with Ai 🚀"
                totalDurationMs={5000}
                loopDelayMs={0}
              />
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              SkillBridge analyzes your skills and builds your personalized path to job-readiness.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/auth">Get Started</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center">
             {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={800}
                height={600}
                className="rounded-xl shadow-2xl glass-card glow-lg"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
