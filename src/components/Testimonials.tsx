import React from 'react';
import { motion } from "motion/react";
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import GradientBackground from '@/components/ui/gradient-background';
const Testimonials = () => {
  const testimonials = [{
    text: "Shattara has completely changed how I study. The AI-generated notes are incredibly accurate and save me hours of work every week.",
    image: "/placeholder.svg",
    name: "Alex Thompson",
    role: "Medical Student"
  }, {
    text: "As a teacher, I've recommended Shattara to all my students. It helps them grasp difficult concepts more quickly and engage more deeply with the material.",
    image: "/placeholder.svg",
    name: "Dr. Sarah Chen",
    role: "University Professor"
  }, {
    text: "The exam simulator is frighteningly accurate! It prepared me so well for my certification that the actual test felt familiar and less stressful.",
    image: "/placeholder.svg",
    name: "Michael Rodriguez",
    role: "IT Professional"
  }, {
    text: "The concept mapping feature helped me visualize connections between different topics. It's like having a personal tutor available 24/7!",
    image: "/placeholder.svg",
    name: "Jordan Kim",
    role: "Computer Science Student"
  }, {
    text: "Shattara's AI has transformed my classroom. Students come to lectures better prepared and ask more insightful questions.",
    image: "/placeholder.svg",
    name: "Prof. James Wilson",
    role: "Biology Department Chair"
  }, {
    text: "The personalized flashcards adapt to my learning pace perfectly. I finally feel confident going into exams.",
    image: "/placeholder.svg",
    name: "Fatima Al-Zahra",
    role: "Engineering Student"
  }, {
    text: "Using Shattara for professional development has been game-changing. The AI creates study materials that perfectly match my learning style.",
    image: "/placeholder.svg",
    name: "Ahmed Hassan",
    role: "Software Engineer"
  }, {
    text: "The collaborative features make group study sessions so much more productive. We can share AI-generated summaries instantly.",
    image: "/placeholder.svg",
    name: "Noor Almansouri",
    role: "Business Student"
  }, {
    text: "As a working professional, Shattara's flexibility allows me to learn efficiently during my limited free time.",
    image: "/placeholder.svg",
    name: "Khalid Bin Rashid",
    role: "Finance Manager"
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
            Trusted by students and educators
          </h2>
          <p className="text-center mt-5 text-muted-foreground">
            Join thousands of students and teachers who are already transforming education with Shattara AI
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