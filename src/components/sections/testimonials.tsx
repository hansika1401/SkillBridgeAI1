import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alex Johnson",
    college: "Stanford University",
    quote: "SkillBridge helped me identify my weak spots and gave me a clear path to landing my dream internship at a FAANG company!",
    image: PlaceHolderImages.find(p => p.id === 'testimonial1')
  },
  {
    name: "Maria Garcia",
    college: "MIT",
    quote: "The AI career coach is a game-changer. It's like having a personal mentor available 24/7. I felt so much more prepared for my interviews.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial2')
  },
  {
    name: "Chen Wei",
    college: "UC Berkeley",
    quote: "I was overwhelmed with all the skills I thought I needed to learn. SkillBridge simplified everything and made my goals achievable.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial3')
  },
  {
    name: "Emily White",
    college: "Carnegie Mellon",
    quote: "Connecting with a mentor from my target industry was invaluable. Their advice was practical and directly applicable to my job search.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial4')
  }
]

const renderStars = (rating: number) => {
  return Array(rating).fill(0).map((_, i) => (
    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
  ))
}

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-background dark:bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Success Stories from Our Users</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            See how SkillBridge is transforming careers for students just like you.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <Card className="h-full glass-card rounded-xl p-6 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                    <CardContent className="flex flex-col items-center text-center gap-4 pt-6">
                       {testimonial.image && (
                        <Image
                          src={testimonial.image.imageUrl}
                          alt={testimonial.name}
                          width={80}
                          height={80}
                          className="rounded-full"
                          data-ai-hint={testimonial.image.imageHint}
                        />
                      )}
                      <div className="flex">
                        {renderStars(5)}
                      </div>
                      <blockquote className="text-lg font-semibold italic">"{testimonial.quote}"</blockquote>
                      <div className="mt-4">
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.college}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}
