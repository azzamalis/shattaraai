import React from 'react';
import SmartCTA from './SmartCTA';
import AnimatedTextCycle from './ui/animated-text-cycle';
const CTA = () => {
  return <section className="py-24 bg-card text-foreground">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-foreground">
            If you're a{' '}
            <AnimatedTextCycle words={["student", "teacher", "worker", "parent", "tutor", "school", "university", "institution"]} interval={3000} className="text-primary" />
            {' '}you deserve better tools!
          </h2>
          <SmartCTA type="get-started" className="text-lg px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
            Try It Now
          </SmartCTA>
        </div>
      </div>
    </section>;
};
export default CTA;