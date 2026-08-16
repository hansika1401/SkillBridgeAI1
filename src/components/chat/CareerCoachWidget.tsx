"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMsg = { id: string; role: "user" | "assistant"; content: string; ts: number };

export function CareerCoachWidget({ userId }: { userId?: string }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [value, setValue] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([{
    id: "welcome",
    role: "assistant",
    content: "Hi! I'm your AI Career Coach. Ask me anything about skills, learning paths, projects, or resume tips.",
    ts: Date.now(),
  }]);

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  // Script injection removed; handled centrally in AiCareerCoach section

  const placeholder = useMemo(() => "Ask anything about your career journey…", []);

  async function sendMessage() {
    const text = value.trim();
    if (!text || sending) return;
    setValue("");
    const id = crypto.randomUUID();
    setMsgs((m) => [...m, { id, role: "user", content: text, ts: Date.now() }]);
    setSending(true);
    try {
      const resp = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userId }),
      });
      const data = await resp.json();
      const reply: string = data?.reply ?? "Sorry, I couldn't generate a response.";
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply, ts: Date.now() }]);
    } catch (e) {
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: "There was an error. Please try again.", ts: Date.now() }]);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      {/* Floating button */}
      <motion.button
        aria-label="Open Your Career Coach"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group relative flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl",
          "ring-2 ring-white/30 hover:scale-105 transition",
        )}
        whileTap={{ scale: 0.97 }}
        title="Open Your Career Coach"
      >
        <Sparkles className="h-6 w-6" />
        <span className="pointer-events-none absolute -top-8 hidden rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-md group-hover:block">Your Career Coach</span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-20 right-0 w-[92vw] max-w-[380px] overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-gradient-to-r from-indigo-600/70 to-purple-600/70 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><MessageCircle className="h-4 w-4"/></div>
              <div className="flex-1">
                <div className="font-medium">Your Career Coach</div>
                <div className="text-xs text-white/80">Ask anything. Friendly, motivating, and concise.</div>
              </div>
              {/* Open external Omnidimension bot if the widget exposes an API; otherwise the script's own bubble will appear */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  const anyWin = window as any;
                  if (anyWin && anyWin.Omnidimension && typeof anyWin.Omnidimension.open === 'function') {
                    anyWin.Omnidimension.open();
                  } else {
                    // Fallback: try to focus any injected widget button if present
                    const bubble = document.querySelector('[data-omnidim-widget], .omnidim-widget-button') as HTMLElement | null;
                    bubble?.click();
                  }
                }}
              >
                Open Your Career Coach
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setOpen(false)}><X className="h-4 w-4"/></Button>
            </div>

            {/* Messages */}
            <div className="max-h-[50vh] min-h-[260px] overflow-y-auto px-3 py-3">
              {msgs.map((m) => (
                <div key={m.id} className={cn("mb-2 flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}> 
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-md",
                    m.role === "user"
                      ? "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white"
                      : "bg-white/15 border border-white/10 backdrop-blur"
                  )}>
                    <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                    <div className="mt-1 text-[10px] opacity-70">{new Date(m.ts).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="mb-2 flex gap-2 justify-start">
                  <div className="max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-md bg-white/15 border border-white/10 backdrop-blur">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:-0.2s]"></span>
                      <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-white/70"></span>
                      <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:0.2s]"></span>
                      <span className="text-xs opacity-70">AI is thinking…</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-white/10 bg-black/20 p-3">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="border-white/20 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-white/40"
              />
              <Button onClick={sendMessage} disabled={sending || !value.trim()} className="bg-white text-black hover:bg-white/90">
                <Send className="h-4 w-4" />
                <span className="ml-1 hidden sm:inline">Send</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
