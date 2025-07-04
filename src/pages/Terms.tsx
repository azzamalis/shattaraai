
import React from 'react';
import TermsHero from '@/components/hero/page-specific/TermsHero';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-[#FAFAFA]">
      <TermsHero />
      
      <section className="py-24 px-6 max-w-6xl mx-auto" data-section="terms">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FAFAFA]">Terms of Service</h1>
          <p className="text-xl text-[#9A9A9A] max-w-3xl mx-auto">
            Please review our terms and conditions for using the Shattara platform.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto prose prose-invert">
          <div className="bg-[#1A1A1A] rounded-xl p-8 border border-[#2E2E2E]">
            <p className="text-[#A6A6A6] mb-6">
              Please provide the actual terms of service text content to replace this placeholder.
            </p>
            <p className="text-[#A6A6A6]">
              The PDF viewer has been removed as requested. You can now paste the actual terms of service text here.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Terms;
