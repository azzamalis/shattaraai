
import React from 'react';
import { LandingLayout } from '@/components/landing/LandingLayout';
import { HeroSection } from '@/components/hero/HeroSection';
import Features from '@/components/Features';
import UseCases from '@/components/UseCases';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <LandingLayout>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <HeroSection />
          <Features />
          <UseCases />
          <Testimonials />
          <Pricing />
          <CTA />
        </main>
        <Footer />
      </div>
    </LandingLayout>
  );
};

export default Index;
