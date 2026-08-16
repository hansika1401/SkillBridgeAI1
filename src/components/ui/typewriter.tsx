"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface TypewriterProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
  speed?: number
  delay?: number
  loopDelayMs?: number
  totalDurationMs?: number
}

export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  loopDelayMs = 0,
  totalDurationMs,
  className,
  ...props
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!isStarted) return

    let interval: NodeJS.Timeout | null = null
    let timeout: NodeJS.Timeout | null = null

    const perCharDelay = totalDurationMs && text.length > 0 ? Math.max(1, Math.floor(totalDurationMs / text.length)) : speed

    const startTyping = () => {
      let i = 0
      interval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText((prev) => prev + text.charAt(i))
          i++
        } else {
          if (interval) clearInterval(interval)
          timeout = setTimeout(() => {
            setDisplayedText("")
            startTyping()
          }, loopDelayMs)
        }
      }, perCharDelay)
    }

    // initial delay already handled by isStarted
    startTyping()

    return () => {
      if (interval) clearInterval(interval)
      if (timeout) clearTimeout(timeout)
    }
  }, [isStarted, text, speed, loopDelayMs, totalDurationMs])

  return (
    <span className={cn(className)} {...props}>
      {displayedText}
      <span className="animate-ping">|</span>
    </span>
  )
}
