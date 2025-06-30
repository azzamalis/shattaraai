
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Lock, FileText, Mail } from 'lucide-react';
import SharedHeroHeader from '../shared/SharedHeroHeader';

const PrivacyHero = () => {
  const scrollToPolicy = () => {
    const policyElement = document.querySelector('[data-section="policy"]');
    if (policyElement) {
      policyElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#121212] text-[#FAFAFA]">
      <SharedHeroHeader />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#141414] px-4 py-2 rounded-full border border-[#2E2E2E] mb-6">
              <Shield className="size-4 text-[#E3E3E3]" />
              <span className="text-sm text-[#9A9A9A]">Privacy Policy</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#FAFAFA]">
              Your Privacy,{' '}
              <span className="text-[#E3E3E3]">Our Commitment</span>
            </h1>
            
            <p className="text-xl text-[#9A9A9A] max-w-3xl mx-auto mb-8">
              We're committed to protecting your personal information and being transparent about 
              how we collect, use, and safeguard your data on the Shattara platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-[#E3E3E3] text-[#171717] hover:bg-[#E3E3E3]/90" onClick={scrollToPolicy}>
              Read Full Policy
            </Button>
            <Button variant="outline" size="lg" className="text-[#FAFAFA] border-[#2E2E2E] hover:border-[#E3E3E3] hover:bg-[#E3E3E3]/10">
              Contact Privacy Team
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Lock className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-lg font-semibold text-[#FAFAFA] mb-1">Secure</div>
              <div className="text-sm text-[#9A9A9A]">End-to-End Encryption</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <FileText className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-lg font-semibold text-[#FAFAFA] mb-1">Transparent</div>
              <div className="text-sm text-[#9A9A9A]">Clear Data Usage</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Mail className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-lg font-semibold text-[#FAFAFA] mb-1">Responsive</div>
              <div className="text-sm text-[#9A9A9A]">Privacy Inquiries</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyHero;
