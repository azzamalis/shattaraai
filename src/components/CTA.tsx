
import React from 'react';
import SmartCTA from './SmartCTA';
import AnimatedTextCycle from './ui/animated-text-cycle';

const CTA = () => {
  return (
    <section className="py-24 bg-dark-deeper text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
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
              className="text-primary"
            />
            {' '}you deserve better tools!
          </h2>
          <SmartCTA 
            type="get-started"
            className="text-lg px-8 py-4 bg-primary hover:bg-primary-light"
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
