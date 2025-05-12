
import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const UseCases = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  const useCases = [
    {
      image: '/placeholder.svg',
      title: 'University Students',
      subtitle: 'Ace your exams with AI-enhanced study tools'
    },
    {
      image: '/placeholder.svg',
      title: 'High School Prep',
      subtitle: 'Build strong foundations for academic success'
    },
    {
      image: '/placeholder.svg',
      title: 'Language Learning',
      subtitle: 'Master vocabulary and grammar effortlessly'
    },
    {
      image: '/placeholder.svg',
      title: 'Professional Certifications',
      subtitle: 'Prepare for industry exams and advance your career'
    },
    {
      image: '/placeholder.svg',
      title: 'Continuous Learning',
      subtitle: 'Stay sharp with lifelong educational support'
    },
    {
      image: '/placeholder.svg',
      title: 'Research Support',
      subtitle: 'Organize and study complex research materials'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Built for any use case
          </h2>
          <p className="text-lg text-gray-600">
            Whatever you're learning, Shattara helps you master it faster and more effectively.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Navigation Arrows */}
          <div className="hidden md:block absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={scrollLeft}
              className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          
          <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={scrollRight}
              className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 py-4 px-1 pb-6 scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
            {useCases.map((useCase, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-[250px] snap-start rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all duration-300"
              >
                <div className="aspect-w-4 aspect-h-3 bg-gray-100">
                  <img 
                    src={useCase.image} 
                    alt={useCase.title}
                    className="w-full h-[150px] object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-base mb-1">{useCase.title}</h3>
                  <p className="text-sm text-gray-600">{useCase.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `
      }} />
    </section>
  );
};

export default UseCases;
