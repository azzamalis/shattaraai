
import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle,
  Headphones,
  BookOpen,
  Building 
} from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our platform? Looking to partner with us? 
            Our team is ready to help you transform education with AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card p-8 rounded-xl border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Your Name</Label>
                <Input 
                  id="name" 
                  className="bg-background border-border focus:border-primary text-foreground" 
                  placeholder="Full Name" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  className="bg-background border-border focus:border-primary text-foreground" 
                  placeholder="your@email.com" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground">Subject</Label>
                <Input 
                  id="subject" 
                  className="bg-background border-border focus:border-primary text-foreground" 
                  placeholder="How can we help?" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">Message</Label>
                <Textarea 
                  id="message" 
                  className="bg-background border-border focus:border-primary text-foreground h-32" 
                  placeholder="Tell us more about your inquiry..." 
                />
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-xl border border-border mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground">Our Location</h3>
                    <p className="text-muted-foreground">Madinah Main Highway Road<br />Al Faisaliyah District<br />Jeddah, KSA</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground">Email Us</h3>
                    <p className="text-muted-foreground">help@shattara.ai<br />support@shattara.ai</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground">Call Us</h3>
                    <p className="text-muted-foreground">+966 53 481 4860<br />+966 55 895 71721</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Specialized Inquiries</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Headphones className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground">Technical Support</h3>
                    <p className="text-muted-foreground">support@shattara.ai<br />+966 53 481 4860</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Building className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground">Partnership Inquiries</h3>
                    <p className="text-muted-foreground">partnerships@shattara.ai<br />+966 53 481 4860</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <BookOpen className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground">Educational Resources</h3>
                    <p className="text-muted-foreground">resources@shattara.ai<br />+966 53 481 4860</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;
