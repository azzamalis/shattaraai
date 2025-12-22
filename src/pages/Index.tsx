
import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import Features from '@/components/Features';
import UseCases from '@/components/UseCases';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow">
        <HeroSection />
        <UseCases />
        <Features />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
