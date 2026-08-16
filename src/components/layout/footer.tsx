import { BrainCircuit, Github, Linkedin, Twitter, Youtube } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer id="footer" className="w-full bg-gray-900 text-gray-300 dark:bg-black">
      <div className="border-t-[1px] border-primary glow-sm"></div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-6 py-12">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold text-white">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span>SkillBridge AI</span>
          </Link>
          <p className="text-sm">Bridging the gap between college and career with the power of Artificial Intelligence.</p>
        </div>
        <div>
          <h3 className="font-headline text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="#problem" className="hover:text-primary transition-colors">The Problem</Link></li>
            <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link href="#mentors" className="hover:text-primary transition-colors">Mentors</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-headline text-lg font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-2">
            <li><a href="mailto:contact@skillbridge.ai" className="hover:text-primary transition-colors">contact@skillbridge.ai</a></li>
            <li><span>123 Tech Avenue, Silicon Valley, CA</span></li>
          </ul>
        </div>
        <div>
          <h3 className="font-headline text-lg font-semibold text-white mb-4">Socials</h3>
          <div className="flex gap-4">
            <Link href="#" aria-label="Twitter" className="text-gray-400 hover:text-primary transition-colors hover:glow-sm rounded-full"><Twitter /></Link>
            <Link href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-primary transition-colors hover:glow-sm rounded-full"><Linkedin /></Link>
            <Link href="#" aria-label="GitHub" className="text-gray-400 hover:text-primary transition-colors hover:glow-sm rounded-full"><Github /></Link>
            <Link href="#" aria-label="YouTube" className="text-gray-400 hover:text-primary transition-colors hover:glow-sm rounded-full"><Youtube /></Link>
          </div>
        </div>
      </div>
      <div className="bg-gray-950 dark:bg-black/50 py-4">
        <div className="container mx-auto text-center text-sm text-gray-500">
          Made with 💜 by Team SkillBridge | Powered by AI
        </div>
      </div>
    </footer>
  )
}
