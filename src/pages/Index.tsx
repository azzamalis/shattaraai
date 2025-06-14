
import React from 'react';
import { SimpleHeroSection } from '@/components/hero/SimpleHeroSection';
// Temporarily comment out complex components
// import { HeroSection } from '@/components/hero/HeroSection';
// import Features from '@/components/Features';
// import UseCases from '@/components/UseCases';
// import Testimonials from '@/components/Testimonials';
// import Pricing from '@/components/Pricing';
// import CTA from '@/components/CTA';
// import Footer from '@/components/Footer';

const Index = () => {
  console.log('Index page rendering...');
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <SimpleHeroSection />
        {/* Temporarily comment out other sections to isolate issues */}
        {/* <Features />
        <UseCases />
        <Testimonials />
        <Pricing />
        <CTA /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Index;
