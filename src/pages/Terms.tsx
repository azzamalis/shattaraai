
import React from 'react';
import TermsHero from '@/components/hero/page-specific/TermsHero';
import Footer from '@/components/Footer';
import { PDFViewer } from '@/components/content/PDFViewer';

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
        
        <div className="h-[800px]">
          <PDFViewer 
            url="/terms-of-service.pdf"
          />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Terms;
