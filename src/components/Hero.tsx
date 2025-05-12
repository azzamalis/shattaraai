
import React, { useState } from 'react';
import Button from './Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 3;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const screenshots = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
  ];

  return (
    <section className="pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Smarter Learning Powered by AI
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your learning experience with AI-generated study materials, personalized flashcards, and realistic exam simulators.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#features" className="text-primary hover:underline text-lg font-medium flex items-center">
                See features
              </a>
              <Button size="lg">Get Started</Button>
            </div>
          </div>

          {/* Right Column - Carousel */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl group">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {screenshots.map((src, index) => (
                <div key={index} className="min-w-full">
                  <img
                    src={src}
                    alt={`Shattara platform screenshot ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={prevSlide}
                className="bg-white bg-opacity-80 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200"
                aria-label="Previous slide"
              >
                <ArrowLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button 
                onClick={nextSlide}
                className="bg-white bg-opacity-80 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200"
                aria-label="Next slide"
              >
                <ArrowRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    activeSlide === index ? 'bg-primary w-6' : 'bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
