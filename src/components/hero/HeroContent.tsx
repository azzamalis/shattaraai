
import React from 'react';
import SmartCTA from '@/components/SmartCTA';
import { AnimatedGroup } from '@/components/ui/animated-group';
import HeroActionLink from './HeroActionLink';
import { Code, Atom, Zap } from 'lucide-react';
import EducationAnimation from './EducationAnimation';
import { scrollToElement } from '@/lib/scrollUtils';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const HeroContent = () => {
  const handleFeatureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToElement('features');
  };

  return (
    <section>
      <div className="relative pt-24 md:pt-36">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  delayChildren: 1,
                },
              },
            },
            item: {
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  bounce: 0.3,
                  duration: 2,
                },
              },
            },
          }}
          className="absolute inset-0 -z-20">
          <div className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block bg-background h-full"></div>
        </AnimatedGroup>
        
        {/* Futuristic gradient background */}
        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_10%,hsl(var(--background))_30%,hsl(var(--primary))_100%)]" />
        
        {/* Animated floating elements */}
        <div className="absolute inset-0 -z-5 overflow-hidden">
          <div className="absolute top-1/3 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-2/3 right-20 w-32 h-32 rounded-full bg-primary/20 blur-3xl opacity-15 animate-[pulse_4s_infinite]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-28 h-28 rounded-full bg-primary/30 blur-3xl opacity-10 animate-[pulse_5s_infinite]"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
            <AnimatedGroup variants={transitionVariants}>
              <HeroActionLink to="/signup" text="AI-Powered Learning Platform" />
  
              <h1
                className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
                Smarter Learning Powered by AI
              </h1>
              <p
                className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                Transform your learning experience with AI-generated study materials, personalized flashcards, and realistic exam simulators.
              </p>
            </AnimatedGroup>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
              <div
                key={1}
                className="bg-primary/20 rounded-[14px] border border-primary/30 p-0.5 shadow-[0_0_15px_rgba(35,35,255,0.3)]">
                <SmartCTA
                  type="get-started"
                  size="lg"
                  className="rounded-xl px-5 text-base h-11 bg-primary hover:bg-primary/90">
                  <Zap className="size-4 mr-1" />
                  <span className="text-nowrap">Get Started</span>
                </SmartCTA>
              </div>
              <SmartCTA
                key={2}
                variant="outline"
                size="lg"
                className="h-11 rounded-xl px-5 border-border text-foreground hover:border-primary hover:bg-primary/20"
                onClick={handleFeatureClick}>
                <Atom className="size-4 mr-1" />
                <span className="text-nowrap">See features</span>
              </SmartCTA>
            </AnimatedGroup>
          </div>
        </div>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}>
          <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
            <div
              aria-hidden
              className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
            />
            <div className="bg-background/20 backdrop-blur-xl relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-primary/10 p-4 shadow-lg shadow-black/15">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              
              {/* Replace static image with the p5.js animation */}
              <EducationAnimation 
                className="aspect-15/8 relative rounded-2xl w-full h-full min-h-[360px]" 
              />
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
};

export default HeroContent;
