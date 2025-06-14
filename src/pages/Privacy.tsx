
import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import Footer from '@/components/Footer';
import { PDFViewer } from '@/components/content/PDFViewer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our commitment to protecting your privacy and handling your data with care.
          </p>
        </div>
        
        <div className="h-[800px]">
          <PDFViewer 
            filePath="/privacy-policy.pdf"
          />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Privacy;
