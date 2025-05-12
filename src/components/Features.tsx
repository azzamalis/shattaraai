
import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '/placeholder.svg',
      title: 'AI-Generated Notes',
      description: 'Turn any content into comprehensive study notes with our advanced AI technology.'
    },
    {
      icon: '/placeholder.svg',
      title: 'Smart Flashcards',
      description: 'Create effective flashcards that adapt to your learning progress for better retention.'
    },
    {
      icon: '/placeholder.svg',
      title: 'Exam Simulators',
      description: 'Practice with realistic exam scenarios tailored to your specific curriculum and goals.'
    },
    {
      icon: '/placeholder.svg',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and personalized insights.'
    }
  ];

  return (
    <section id="features" className="py-24 bg-accent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">
            AI-generated notes, flashcards, and exam simulators—all in one place.
          </h2>
          <p className="text-lg text-gray-600">
            Our integrated platform helps you study smarter, not harder, with tools designed to accelerate your learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="mb-6">
                <img 
                  src={feature.icon} 
                  alt={`${feature.title} icon`} 
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
