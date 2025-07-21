import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, TrendingUp, Zap } from 'lucide-react';
import SharedHeroHeader from '../shared/SharedHeroHeader';
import ZcalModal from '@/components/ZcalModal';
const TeachersHero = () => {
  return <div className="bg-[#121212] text-[#FAFAFA]">
      <SharedHeroHeader />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#141414] px-4 py-2 rounded-full border border-[#2E2E2E] mb-6">
              <GraduationCap className="size-4 text-[#E3E3E3]" />
              <span className="text-sm text-[#9A9A9A]">For Educators</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#FAFAFA]">
              Transform Your{' '}
              <span className="text-[#E3E3E3]">Classroom</span>{' '}
              with AI
            </h1>
            
            <p className="text-xl text-[#9A9A9A] max-w-3xl mx-auto mb-8">
              Join thousands of educators across the Gulf region who are revolutionizing their teaching 
              with AI-powered tools that save time and enhance student engagement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <ZcalModal bookingUrl="https://zcal.co/i/4vqAOC__?embed=1&embedType=iframe" title="Schedule a School Demo" embedHeight={966} embedWidth={1096} modalName="teacher_demo">
              <Button size="lg" className="bg-[#E3E3E3] text-[#171717] hover:bg-[#E3E3E3]/90">
                Request School Demo
              </Button>
            </ZcalModal>
            
          </div>

          {/* Social proof */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Users className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-2xl font-bold text-[#FAFAFA] mb-1">500+</div>
              <div className="text-sm text-[#9A9A9A]">Active Teachers</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-2xl font-bold text-[#FAFAFA] mb-1">85%</div>
              <div className="text-sm text-[#9A9A9A]">Improved Test Scores</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Zap className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-2xl font-bold text-[#FAFAFA] mb-1">10hrs</div>
              <div className="text-sm text-[#9A9A9A]">Saved Per Week</div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default TeachersHero;