import React from 'react';
import { FeaturesSectionWithHoverEffects } from '@/components/ui/feature-section-with-hover-effects';
import GradientBackground from '@/components/ui/gradient-background';
const Features = () => {
  return <section id="features" className="pt-20 md:pt-24 lg:pt-32 pb-12 md:pb-16 lg:pb-20 bg-[#121212] relative">
      <GradientBackground />
      <div className="container mx-auto px-4 md:px-6 relative z-10 bg-card ">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-foreground">AI-generated summaries, flashcards, and exam simulators—all in one place.</h2>
          <p className="text-lg text-[#9A9A9A]">
            Our integrated platform helps you study smarter, not harder, with tools designed to accelerate your learning.
          </p>
        </div>
        <FeaturesSectionWithHoverEffects />
      </div>
    </section>;
};
export default Features;