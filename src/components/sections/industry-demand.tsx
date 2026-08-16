"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/firebase"
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from "recharts"
import { Card } from "../ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"

const targetData = [
  { skill: "Python", demand: 80 },
  { skill: "Cloud", demand: 85 },
  { skill: "UI/UX", demand: 90 },
  { skill: "Data Analyst", demand: 97 },
  { skill: "AI/ML", demand: 75 },
]

const chartConfig = {
  demand: {
    label: "Demand",
    color: "hsl(var(--primary))",
  },
}

export function IndustryDemand() {
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  const [data, setData] = useState(targetData.map(d => ({ ...d, demand: 0 })))
  const { user, isUserLoading } = useUser()

  // Observe when section enters viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Animate values to targets when in view
  useEffect(() => {
    if (!inView) return
    let frame: number
    const duration = 900 // ms
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOutQuad
      setData(targetData.map(d => ({ ...d, demand: Math.round(d.demand * eased) })))
      if (t < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        setData(targetData)
      }
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [inView])

  const handleBarClick = (_entry: any) => {
    const target = "/dashboard"
    if (isUserLoading || !user || (user as any).isAnonymous) {
      router.push(`/auth?redirect=${encodeURIComponent(target)}`)
      return
    }
    router.push(target)
  }

  return (
    <section id="industry-demand" className="bg-gray-900 text-white dark:bg-black">
      <div className="container mx-auto px-4 md:px-6 text-center" ref={sectionRef}>
        <div className="mb-12 space-y-2">
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Stay Ahead of the Curve</h2>
          <p className="max-w-3xl mx-auto text-gray-400 md:text-xl/relaxed">
            SkillBridge uses real-time data to guide your next learning step, focusing on the most in-demand skills.
          </p>
        </div>

        <Card className="glass-card bg-gray-800/30 border-primary/20 p-6 shadow-2xl shadow-primary/10">
          <h3 className="text-2xl font-headline font-bold mb-4 text-left">Top 5 In-Demand Skills for 2025</h3>
          <div className="h-[380px]">
            <div
              role="button"
              tabIndex={0}
              onClick={handleBarClick}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBarClick(null) }}
              className="w-full h-full cursor-pointer"
            >
              <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                <XAxis dataKey="skill" stroke="hsl(var(--foreground) / 0.5)" />
                <YAxis stroke="hsl(var(--foreground) / 0.5)" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--primary) / 0.08)' }}
                  content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="demand" fill="var(--color-demand)" radius={[4, 4, 0, 0]} isAnimationActive>
                  <LabelList dataKey="demand" position="top" formatter={(v: number) => `${v}%`} />
                </Bar>
              </BarChart>
              </ChartContainer>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
