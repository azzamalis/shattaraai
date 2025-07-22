
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Scale, MessageCircle, Calendar } from 'lucide-react';
import SharedHeroHeader from '../shared/SharedHeroHeader';

const TermsHero = () => {
  const navigate = useNavigate();

  const scrollToTerms = () => {
    const termsElement = document.querySelector('[data-section="terms"]');
    if (termsElement) {
      termsElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="bg-background text-foreground">
      <SharedHeroHeader />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Clear Terms,{' '}
              <span className="text-primary">Fair Service</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Our terms of service outline the rights and responsibilities for using Shattara. 
              We believe in transparency and fair practices for all our users.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={scrollToTerms}>
              Read Terms
            </Button>
            <Button variant="outline" size="lg" onClick={handleContactClick}>
              Have Questions?
            </Button>
          </div>

          {/* Service highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="size-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <FileText className="size-6 text-muted-foreground" />
              </div>
              <div className="text-lg font-semibold text-foreground mb-1">Clear Language</div>
              <div className="text-sm text-muted-foreground">Easy to Understand</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <MessageCircle className="size-6 text-muted-foreground" />
              </div>
              <div className="text-lg font-semibold text-foreground mb-1">Support Available</div>
              <div className="text-sm text-muted-foreground">Questions Welcome</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <Calendar className="size-6 text-muted-foreground" />
              </div>
              <div className="text-lg font-semibold text-foreground mb-1">Updated Jul 2025</div>
              <div className="text-sm text-muted-foreground">Latest Version</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsHero;
