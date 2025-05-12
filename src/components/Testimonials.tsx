
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials = [
    {
      quote: "Shattara has completely changed how I study. The AI-generated notes are incredibly accurate and save me hours of work every week.",
      avatar: '/placeholder.svg',
      name: 'Alex Thompson',
      role: 'Medical Student'
    },
    {
      quote: "As a teacher, I've recommended Shattara to all my students. It helps them grasp difficult concepts more quickly and engage more deeply with the material.",
      avatar: '/placeholder.svg',
      name: 'Dr. Sarah Chen',
      role: 'University Professor'
    },
    {
      quote: "The exam simulator is frighteningly accurate! It prepared me so well for my certification that the actual test felt familiar and less stressful.",
      avatar: '/placeholder.svg',
      name: 'Michael Rodriguez',
      role: 'IT Professional'
    }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-accent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Buttons */}
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 md:-translate-x-12 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 md:translate-x-12 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Testimonial Slider */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-12">
                  <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                    <blockquote className="text-lg md:text-xl mb-8">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex flex-col items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-14 h-14 rounded-full mb-3"
                      />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  activeSlide === index ? 'bg-primary w-6' : 'bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
