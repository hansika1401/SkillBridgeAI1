import { UserPlus, BrainCircuit, ListChecks, Users, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const timelineSteps = [
  {
    icon: <UserPlus className="h-8 w-8" />,
    title: "Create Your Profile",
    description: "Tell us about your skills, education, and career goals. The more we know, the better we can help.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: "AI Analyzes Your Skills",
    description: "Our AI engine analyzes your profile against millions of data points from successful careers.",
  },
  {
    icon: <ListChecks className="h-8 w-8" />,
    title: "Get a Personalized Path",
    description: "Receive a step-by-step learning roadmap with courses, projects, and resources tailored just for you.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Connect with Mentors",
    description: "Get guidance and support from industry professionals who have been in your shoes.",
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "Track Progress &amp; Get Jobs",
    description: "Visualize your growth and unlock job matches that align with your newly acquired skills.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background dark:bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">A Smarter Way to Start Your Career</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Follow our simple, AI-driven process to go from student to sought-after professional.
          </p>
        </div>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-cyan-500/30 dark:bg-cyan-400/50 glow-sm"></div>

          {timelineSteps.map((step, index) => (
            <div key={index} className="relative mb-12 flex items-center w-full">
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                <Card className="inline-block glass-card rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Timeline circle and icon */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-background border-2 border-cyan-500/50 text-cyan-500 dark:bg-card dark:text-cyan-400 glow">
                  {step.icon}
                </div>
              </div>

              <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}>
                {/* Empty div for spacing */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
