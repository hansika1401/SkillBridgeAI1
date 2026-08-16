"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-600 text-white">
      <div className="container mx-auto px-4 py-14 md:py-20">
        <div className="max-w-3xl">
          <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight">
            Your AI Skill Growth Dashboard
          </h1>
          <p className="mt-3 md:mt-4 text-white/80 md:text-lg">
            Track progress, get AI insights, and grow smarter.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Skill Readiness", value: "78%", emoji: "🎯" },
            { label: "Missing Skills", value: "3", emoji: "🧠" },
            { label: "Recommended Projects", value: "2", emoji: "🚀" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.5, ease: "easeOut" }}
              className="rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur-md shadow-lg"
            >
              <div className="text-2xl">{s.emoji}</div>
              <div className="mt-2 text-sm uppercase tracking-wider text-white/75">
                {s.label}
              </div>
              <div className="text-2xl font-semibold">{s.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_0%_0%,rgba(255,255,255,0.15),transparent),radial-gradient(800px_400px_at_100%_0%,rgba(255,255,255,0.12),transparent)]" />
    </section>
  );
}
