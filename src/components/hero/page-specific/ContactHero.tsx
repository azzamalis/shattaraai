import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Clock, Headphones, Mail } from 'lucide-react';
import SharedHeroHeader from '../shared/SharedHeroHeader';
const ContactHero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="bg-background text-foreground">
      <SharedHeroHeader />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Get the{' '}
              <span className="text-primary">Support</span>{' '}
              You Need
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Our dedicated support team is here to help you succeed. Whether you have questions about 
              features, need technical assistance, or want to explore partnerships, we're ready to help.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={scrollToForm}>
              Send Message
            </Button>
            
          </div>

          {/* Support promises */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="size-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <Clock className="size-6 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">24-48h</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <Headphones className="size-6 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <Mail className="size-6 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">89%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default ContactHero;