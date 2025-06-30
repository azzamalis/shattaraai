
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Scale, MessageCircle, Calendar } from 'lucide-react';
import SharedHeroHeader from '../shared/SharedHeroHeader';

const TermsHero = () => {
  const scrollToTerms = () => {
    const termsElement = document.querySelector('[data-section="terms"]');
    if (termsElement) {
      termsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#121212] text-[#FAFAFA]">
      <SharedHeroHeader />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#141414] px-4 py-2 rounded-full border border-[#2E2E2E] mb-6">
              <Scale className="size-4 text-[#E3E3E3]" />
              <span className="text-sm text-[#9A9A9A]">Terms of Service</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#FAFAFA]">
              Clear Terms,{' '}
              <span className="text-[#E3E3E3]">Fair Service</span>
            </h1>
            
            <p className="text-xl text-[#9A9A9A] max-w-3xl mx-auto mb-8">
              Our terms of service outline the rights and responsibilities for using Shattara. 
              We believe in transparency and fair practices for all our users.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-[#E3E3E3] text-[#171717] hover:bg-[#E3E3E3]/90" onClick={scrollToTerms}>
              Read Terms
            </Button>
            <Button variant="outline" size="lg" className="text-[#FAFAFA] border-[#2E2E2E] hover:border-[#E3E3E3] hover:bg-[#E3E3E3]/10">
              Have Questions?
            </Button>
          </div>

          {/* Service highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <FileText className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-lg font-semibold text-[#FAFAFA] mb-1">Clear Language</div>
              <div className="text-sm text-[#9A9A9A]">Easy to Understand</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <MessageCircle className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-lg font-semibold text-[#FAFAFA] mb-1">Support Available</div>
              <div className="text-sm text-[#9A9A9A]">Questions Welcome</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Calendar className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-lg font-semibold text-[#FAFAFA] mb-1">Updated Dec 2024</div>
              <div className="text-sm text-[#9A9A9A]">Latest Version</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsHero;
