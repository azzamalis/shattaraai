
import React from 'react';
import { FeaturesSectionWithHoverEffects } from '@/components/ui/feature-section-with-hover-effects';

const Features = () => {
  return (
    <section id="features" className="py-24 bg-dark-deeper">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white">
            AI-generated notes, flashcards, and exam simulators—all in one place.
          </h2>
          <p className="text-lg text-white/70">
            Our integrated platform helps you study smarter, not harder, with tools designed to accelerate your learning.
          </p>
        </div>

        <FeaturesSectionWithHoverEffects />
      </div>
    </section>
  );
};

export default Features;
