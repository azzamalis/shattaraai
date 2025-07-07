
import React from 'react';
import SmartCTA from './SmartCTA';
import AnimatedTextCycle from './ui/animated-text-cycle';
import { Squares } from './ui/squares-background';

const CTA = () => {
  return (
    <section className="relative py-24 bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0">
        <Squares 
          direction="diagonal"
          speed={0.3}
          squareSize={50}
          borderColor="hsl(var(--border))"
          hoverFillColor="hsl(var(--muted))"
        />
      </div>
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            If you're a{' '}
            <AnimatedTextCycle 
              words={[
                "student",
                "teacher",
                "worker",
                "parent",
                "tutor",
                "school",
                "university",
                "institution"
              ]}
              interval={3000}
              className="text-[#00A3FF]"
            />
            {' '}you deserve better tools!
          </h2>
          <SmartCTA 
            type="get-started"
            className="text-lg px-8 py-4 bg-[#E3E3E3] text-[#171717] hover:bg-[#E3E3E3]/90"
            size="lg"
          >
            Try It Now
          </SmartCTA>
        </div>
      </div>
    </section>
  );
};

export default CTA;
