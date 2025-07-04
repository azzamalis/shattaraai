
import React from 'react';
import PrivacyHero from '@/components/hero/page-specific/PrivacyHero';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-[#FAFAFA]">
      <PrivacyHero />
      
      <section className="py-24 px-6 max-w-6xl mx-auto" data-section="policy">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FAFAFA]">Privacy Policy</h1>
          <p className="text-xl text-[#9A9A9A] max-w-3xl mx-auto">
            Our commitment to protecting your privacy and handling your data with care.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto prose prose-invert">
          <div className="bg-[#1A1A1A] rounded-xl p-8 border border-[#2E2E2E]">
            <p className="text-[#A6A6A6] mb-6">
              Please provide the actual privacy policy text content to replace this placeholder.
            </p>
            <p className="text-[#A6A6A6]">
              The PDF viewer has been removed as requested. You can now paste the actual privacy policy text here.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Privacy;
