import React from 'react';
import { TestimonialsSection } from '@/components/ui/testimonials-with-marquee';
import GradientBackground from '@/components/ui/gradient-background';

const Testimonials = () => {
  const testimonials = [
    {
      author: {
        name: 'Alex Thompson',
        handle: '@alexthompson',
        avatar: '/placeholder.svg',
        role: 'Medical Student'
      },
      text: "Shattara has completely changed how I study. The AI-generated notes are incredibly accurate and save me hours of work every week."
    },
    {
      author: {
        name: 'Dr. Sarah Chen',
        handle: '@drsarahchen',
        avatar: '/placeholder.svg',
        role: 'University Professor'
      },
      text: "As a teacher, I've recommended Shattara to all my students. It helps them grasp difficult concepts more quickly and engage more deeply with the material."
    },
    {
      author: {
        name: 'Michael Rodriguez',
        handle: '@michaelr',
        avatar: '/placeholder.svg',
        role: 'IT Professional'
      },
      text: "The exam simulator is frighteningly accurate! It prepared me so well for my certification that the actual test felt familiar and less stressful."
    },
    {
      author: {
        name: 'Jordan Kim',
        handle: '@jordank',
        avatar: '/placeholder.svg',
        role: 'Computer Science Student'
      },
      text: "The concept mapping feature helped me visualize connections between different topics. It's like having a personal tutor available 24/7!"
    },
    {
      author: {
        name: 'Prof. James Wilson',
        handle: '@profwilson',
        avatar: '/placeholder.svg',
        role: 'Biology Department Chair'
      },
      text: "Shattara's AI has transformed my classroom. Students come to lectures better prepared and ask more insightful questions."
    }
  ];

  return (
    <section className="py-24 bg-dark-deeper relative">
      <GradientBackground />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <TestimonialsSection
          title="Trusted by students and educators"
          description="Join thousands of students and teachers who are already transforming education with Shattara AI"
          testimonials={testimonials}
        />
      </div>
    </section>
  );
};

export default Testimonials;
