
import React from 'react';
import PrivacyHero from '@/components/hero/page-specific/PrivacyHero';
import Footer from '@/components/Footer';
import { PDFViewer } from '@/components/content/PDFViewer';

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
        
        <div className="h-[800px]">
          <PDFViewer 
            url="/privacy-policy.pdf"
          />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Privacy;
