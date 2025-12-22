import React from 'react';
import { motion } from "motion/react";
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import GradientBackground from '@/components/ui/gradient-background';
const Testimonials = () => {
  const testimonials = [{
    text: "Shattara AI helped me finally understand my lectures instead of memorizing blindly.",
    image: "/placeholder.svg",
    name: "Sarah M.",
    role: "University Student"
  }, {
    text: "The quizzes feel like real exams — and the explanations actually help.",
    image: "/placeholder.svg",
    name: "Ahmed K.",
    role: "High School Student"
  }, {
    text: "I used to spend hours making flashcards. Now it takes seconds, and they're better than what I made myself.",
    image: "/placeholder.svg",
    name: "Fatima A.",
    role: "Engineering Student"
  }, {
    text: "The AI summaries helped me review an entire semester in one weekend.",
    image: "/placeholder.svg",
    name: "Omar H.",
    role: "Medical Student"
  }, {
    text: "My students come to class more prepared since I started recommending Shattara.",
    image: "/placeholder.svg",
    name: "Dr. Layla N.",
    role: "University Professor"
  }, {
    text: "I finally feel confident going into exams. The practice tests are spot-on.",
    image: "/placeholder.svg",
    name: "Noor S.",
    role: "Law Student"
  }, {
    text: "It's like having a tutor available 24/7 who actually knows my course material.",
    image: "/placeholder.svg",
    name: "Khalid R.",
    role: "Computer Science Student"
  }, {
    text: "The study chat answered questions my textbook never could.",
    image: "/placeholder.svg",
    name: "Maha T.",
    role: "Business Student"
  }, {
    text: "I recommend Shattara to every student who struggles with exam prep.",
    image: "/placeholder.svg",
    name: "Prof. Saeed B.",
    role: "Department Chair"
  }];
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);
  return <section className="py-24 bg-background relative">
      <GradientBackground />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1]
      }} viewport={{
        once: true
      }} className="flex flex-col items-center justify-center max-w-[540px] mx-auto">
          

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-foreground">
            Trusted by Students and Educators
          </h2>
          <p className="text-center mt-5 text-muted-foreground">
            Thousands of learners already use Shattara AI to study faster, understand better, and stress less.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>;
};
export default Testimonials;