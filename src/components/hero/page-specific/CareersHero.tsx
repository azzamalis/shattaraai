import React from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase, Heart, Rocket, Users } from 'lucide-react';
import SharedHeroHeader from '../shared/SharedHeroHeader';
const CareersHero = () => {
  const scrollToPositions = () => {
    const positionsElement = document.querySelector('[data-section="positions"]');
    if (positionsElement) {
      positionsElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="bg-[#121212] text-[#FAFAFA]">
      <SharedHeroHeader />
      <section className="pt-32 pb-20 px-6 bg-background ">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#FAFAFA]">
              Build the Future of{' '}
              <span className="text-[#E3E3E3]">Education</span>
            </h1>
            
            <p className="text-xl text-[#9A9A9A] max-w-3xl mx-auto mb-8">
              Join a mission-driven team that's revolutionizing education through AI. Work with passionate 
              individuals who believe in making quality learning accessible to everyone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-[#E3E3E3] text-[#171717] hover:bg-[#E3E3E3]/90" onClick={scrollToPositions}>
              View Open Positions
            </Button>
            
          </div>

          {/* Company highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Heart className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-lg font-semibold text-[#FAFAFA] mb-1">Mission-Driven</div>
              <div className="text-sm text-[#9A9A9A]">Meaningful Work</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Rocket className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-lg font-semibold text-[#FAFAFA] mb-1">Fast Growth</div>
              <div className="text-sm text-[#9A9A9A]">Career Development</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Users className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-lg font-semibold text-[#FAFAFA] mb-1">Great Culture</div>
              <div className="text-sm text-[#9A9A9A]">Work-Life Balance</div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default CareersHero;