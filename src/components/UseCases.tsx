// Test commit - UseCases component for educational platform
import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, GraduationCap, BookOpen, Languages, Award, Brain, FileSearch } from 'lucide-react';
import { motion } from 'framer-motion';
import GradientBackground from '@/components/ui/gradient-background';
import { cn } from '@/lib/utils';
const UseCases = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };
  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = 300; // card width + gap
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      scrollLeft();
    } else if (e.key === 'ArrowRight') {
      scrollRight();
    }
  };
  const useCases = [{
    image: '/images/university_students.png',
    title: 'University Students',
    subtitle: 'Ace your exams with AI-enhanced study tools',
    category: 'Academic',
    icon: <GraduationCap className="w-5 h-5 text-primary" />,
    features: ['AI-generated study notes', 'Smart flashcard system', 'Exam simulation tools'],
    stats: '85% of students report improved grades',
    testimonial: {
      quote: "This platform transformed how I study for exams",
      author: "Sarah M., Computer Science Student"
    }
  }, {
    image: '/images/high_school_prep.png',
    title: 'High School Prep',
    subtitle: 'Build strong foundations for academic success',
    category: 'Academic',
    icon: <BookOpen className="w-5 h-5 text-primary" />,
    features: ['Personalized learning paths', 'Interactive study materials', 'Progress tracking'],
    stats: '92% of students feel more confident',
    testimonial: {
      quote: "Makes studying for tests so much easier",
      author: "James K., High School Student"
    }
  }, {
    image: '/images/language_learning.png',
    title: 'Language Learning',
    subtitle: 'Master vocabulary and grammar effortlessly',
    category: 'Skills',
    icon: <Languages className="w-5 h-5 text-primary" />,
    features: ['AI-powered language practice', 'Vocabulary building tools', 'Grammar correction'],
    stats: '3x faster language acquisition',
    testimonial: {
      quote: "Finally found a way to learn languages that works",
      author: "Maria L., Language Learner"
    }
  }, {
    image: '/images/professional_certifications.png',
    title: 'Professional Certifications',
    subtitle: 'Prepare for industry exams and advance your career',
    category: 'Professional',
    icon: <Award className="w-5 h-5 text-primary" />,
    features: ['Industry-specific content', 'Practice exams', 'Career guidance'],
    stats: '78% pass rate on first attempt',
    testimonial: {
      quote: "Helped me get my dream certification",
      author: "David R., IT Professional"
    }
  }];
  const cardVariants = {
    initial: {
      scale: 1
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };
  return <section className="pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-12 lg:pb-16 bg-background relative">
      <GradientBackground />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-foreground">
            Designed for every learning journey
          </h2>
          <p className="text-center mt-5 text-muted-foreground">Our platform adapts to your needs, whether you're a student, a teacher, or a work professional.</p>
        </div>
        
        <div role="region" aria-label="Use Cases Carousel" className="relative">
          {/* Navigation Arrows - Desktop Only */}
          <div className="hidden md:block absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
            <button onClick={scrollLeft} className="p-3 rounded-full bg-[#00A3FF]/10 backdrop-blur-sm text-[#00A3FF] hover:bg-[#00A3FF]/20 hover:text-[#00A3FF] transition-colors border border-[#00A3FF]/20 shadow-[0_2px_8px_rgba(0,163,255,0.15)]" aria-label="Scroll left">
              <ArrowLeft size={24} />
            </button>
          </div>
          
          {/* Carousel Content */}
          <div ref={scrollRef} role="list" className={cn("flex gap-6 pb-6", isMobile ? "flex-col" : "overflow-x-auto snap-x scroll-smooth hide-scrollbar")} onKeyDown={handleKeyNavigation} tabIndex={0}>
            {useCases.map((useCase, index) => <motion.div key={index} role="listitem" aria-label={`${useCase.title} - ${useCase.subtitle}`} className={cn("bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-primary/50", isMobile ? "w-full" : "min-w-[300px] flex-shrink-0 snap-start")} variants={cardVariants} initial="initial" whileHover="hover">
                <div className="relative">
                  <img src={useCase.image} alt={useCase.title} loading="lazy" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" onLoad={e => e.currentTarget.classList.add('loaded')} />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-card/90 backdrop-blur-sm border border-border text-foreground hover:bg-card transition-colors">
                      {useCase.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {useCase.icon}
                    <h3 className="text-xl font-bold text-foreground">{useCase.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{useCase.subtitle}</p>
                  
                  {/* Features List */}
                  <ul className="space-y-2 mb-4">
                    {useCase.features.map((feature, idx) => <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                        {feature}
                      </li>)}
                  </ul>
                  
                  {/* Stats */}
                  <div className="text-sm text-primary font-medium mb-4">
                    {useCase.stats}
                  </div>
                  
                  {/* Testimonial */}
                  <div className="text-sm text-muted-foreground italic">
                    "{useCase.testimonial.quote}"
                    <div className="text-foreground mt-1">
                      - {useCase.testimonial.author}
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </div>
          
          {/* Navigation Arrows - Desktop Only */}
          <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
            <button onClick={scrollRight} className="p-3 rounded-full bg-[#00A3FF]/10 backdrop-blur-sm text-[#00A3FF] hover:bg-[#00A3FF]/20 hover:text-[#00A3FF] transition-colors border border-[#00A3FF]/20 shadow-[0_2px_8px_rgba(0,163,255,0.15)]" aria-label="Scroll right">
              <ArrowRight size={24} />
            </button>
          </div>
          
          {/* Pagination Dots - Desktop Only */}
          <div className="hidden md:flex justify-center gap-3 mt-6">
            {useCases.map((_, index) => <button key={index} onClick={() => scrollToCard(index)} className="w-6 h-6 rounded-full transition-colors flex items-center justify-center" aria-label={`Go to slide ${index + 1}`}>
                <span className={cn("w-2 h-2 rounded-full transition-colors", activeIndex === index ? "bg-primary" : "bg-primary/30")} />
              </button>)}
          </div>
        </div>
      </div>
    </section>;
};
export default UseCases;