// Test commit - UseCases component for educational platform
import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import GradientBackground from '@/components/ui/gradient-background';

const UseCases = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -250,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 250,
        behavior: 'smooth'
      });
    }
  };
  
  const useCases = [
    {
      image: '/images/university_students.png',
      title: 'University Students',
      subtitle: 'Ace your exams with AI-enhanced study tools'
    }, 
    {
      image: '/images/high_school_prep.png',
      title: 'High School Prep',
      subtitle: 'Build strong foundations for academic success'
    }, 
    {
      image: '/images/language_learning.png',
      title: 'Language Learning',
      subtitle: 'Master vocabulary and grammar effortlessly'
    }, 
    {
      image: '/images/professional_certifications.png',
      title: 'Professional Certifications',
      subtitle: 'Prepare for industry exams and advance your career'
    }, 
    {
      image: '/images/continuous_learning.png',
      title: 'Continuous Learning',
      subtitle: 'Stay sharp with lifelong educational support'
    }, 
    {
      image: '/images/research_support.png',
      title: 'Research Support',
      subtitle: 'Organize and study complex research materials'
    }
  ];
  
  return (
    <section className="py-24 bg-dark-deeper relative">
      <GradientBackground />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Designed for every learning journey
          </h2>
          <p className="text-lg text-white/70">
            Our platform adapts to your needs, whether you're a student, professional, or lifelong learner.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
            <button 
              onClick={scrollLeft} 
              className="p-2 rounded-full bg-dark-deeper text-white hover:bg-primary transition-colors"
              aria-label="Scroll left"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
          
          <div 
            ref={scrollRef} 
            className="flex overflow-x-auto gap-6 pb-6 snap-x scroll-smooth hide-scrollbar"
          >
            {useCases.map((useCase, index) => (
              <div 
                key={index} 
                className="min-w-[300px] flex-shrink-0 snap-start bg-dark-deeper rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={useCase.image} 
                  alt={useCase.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">{useCase.title}</h3>
                  <p className="text-white/70">{useCase.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
            <button 
              onClick={scrollRight} 
              className="p-2 rounded-full bg-dark-deeper text-white hover:bg-primary transition-colors"
              aria-label="Scroll right"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
