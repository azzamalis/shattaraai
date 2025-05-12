
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import HeroActionLink from './HeroActionLink';

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
          <div className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block bg-dark-deeper h-full"></div>
        </AnimatedGroup>
        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
            <AnimatedGroup variants={transitionVariants}>
              <HeroActionLink to="#features" text="AI-Powered Learning Platform" />
  
              <h1
                className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                Smarter Learning Powered by AI
              </h1>
              <p
                className="mx-auto mt-8 max-w-2xl text-balance text-lg text-gray-600">
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
                className="bg-primary/10 rounded-[14px] border p-0.5">
                <Button
                  size="lg"
                  className="rounded-xl px-5 text-base h-11">
                  <span className="text-nowrap">Get Started</span>
                </Button>
              </div>
              <Button
                key={2}
                variant="outline"
                size="lg"
                className="h-11 rounded-xl px-5">
                <span className="text-nowrap">See features</span>
              </Button>
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
            <div className="bg-white/5 relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-black/15">
              <img
                className="aspect-15/8 relative rounded-2xl"
                src="/placeholder.svg"
                alt="Shattara platform screenshot"
                width="2700"
                height="1440"
              />
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
};

export default HeroContent;
