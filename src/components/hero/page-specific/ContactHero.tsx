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
  return <div className="bg-[#121212] text-[#FAFAFA]">
      <SharedHeroHeader />
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#FAFAFA]">
              Get the{' '}
              <span className="text-[#E3E3E3]">Support</span>{' '}
              You Need
            </h1>
            
            <p className="text-xl text-[#9A9A9A] max-w-3xl mx-auto mb-8">
              Our dedicated support team is here to help you succeed. Whether you have questions about 
              features, need technical assistance, or want to explore partnerships, we're ready to help.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={scrollToForm}>
              Send Message
            </Button>
            
          </div>

          {/* Support promises */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Clock className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-2xl font-bold text-[#FAFAFA] mb-1">24-48h</div>
              <div className="text-sm text-[#9A9A9A]">Response Time</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Headphones className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-2xl font-bold text-[#FAFAFA] mb-1">24/7</div>
              <div className="text-sm text-[#9A9A9A]">Support Available</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-[#E3E3E3]/10 mx-auto mb-3 flex items-center justify-center">
                <Mail className="size-6 text-[#E3E3E3]" />
              </div>
              <div className="text-2xl font-bold text-[#FAFAFA] mb-1">99%</div>
              <div className="text-sm text-[#9A9A9A]">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default ContactHero;