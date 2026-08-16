import { Hero } from '@/components/sections/hero';
import { ProblemMission } from '@/components/sections/problem-mission';
import { HowItWorks } from '@/components/sections/how-it-works';
import { DashboardPreview } from '@/components/sections/dashboard-preview';
import { MentorConnect } from '@/components/sections/mentor-connect';
import { IndustryDemand } from '@/components/sections/industry-demand';
import { AiCareerCoach } from '@/components/sections/ai-career-coach';
import { Testimonials } from '@/components/sections/testimonials';
import { Signup } from '@/components/sections/signup';

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemMission />
      <HowItWorks />
      <DashboardPreview />
      <MentorConnect />
      <IndustryDemand />
      <AiCareerCoach />
      <Testimonials />
      <Signup />
    </>
  );
}
