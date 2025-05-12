
import React from 'react';

const TrustBar = () => {
  // In a real application, these would be actual company logos
  const logos = Array(8).fill('/placeholder.svg');

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h3 className="text-2xl font-semibold mb-10">
          Loved by over 1 million learners
        </h3>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee space-x-12">
            {logos.concat(logos).map((logo, index) => (
              <div key={index} className="flex-shrink-0 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img 
                  src={logo} 
                  alt={`Partner company ${index % logos.length + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
