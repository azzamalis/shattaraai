
import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import Footer from '@/components/Footer';
import PDFViewer from '@/components/PDFViewer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <HeroSection />
      
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Please review our terms and conditions for using the Shattara platform.
          </p>
        </div>
        
        <PDFViewer 
          title="Terms of Service" 
          description="Our Terms of Service PDF is currently being prepared. Once uploaded, you'll be able to view and download it from this page."
          pdfPlaceholder={true}
          pdfPath="/terms-of-service.pdf"
        />
      </section>
      
      <Footer />
    </div>
  );
};

export default Terms;
