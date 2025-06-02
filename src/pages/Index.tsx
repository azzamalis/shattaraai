
import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import Features from '@/components/Features';
import { AnimatedTextCycleDemo } from '@/components/ui/demo';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <Features />
        <section className="py-24 bg-dark">
          <div className="container mx-auto px-4 md:px-6 flex justify-center">
            <AnimatedTextCycleDemo />
          </div>
        </section>
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
