"use client"

import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <Button
      variant="default"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-4 right-4 rounded-full shadow-lg transition-opacity duration-300 z-50",
        "bg-primary/80 backdrop-blur-sm hover:bg-primary",
        "dark:bg-accent/80 dark:hover:bg-accent",
        "glow",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  )
}
