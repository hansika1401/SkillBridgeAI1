"use client"

import { useEffect, useState } from "react"

export function AnimatedNumber({ value }: { value: number }) {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) return

    const duration = 2000
    const increment = end / (duration / 10)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        start = end
        clearInterval(timer)
      }
      setCurrentValue(Math.ceil(start))
    }, 10)

    return () => clearInterval(timer)
  }, [value])

  return <span>{currentValue}</span>
}
