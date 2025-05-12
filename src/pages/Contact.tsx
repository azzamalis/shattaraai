
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
    <div className="min-h-screen bg-dark text-white">
      <HeroSection />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have questions about our platform? Looking to partner with us? 
            Our team is ready to help you transform education with AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-dark-deeper p-8 rounded-xl border border-primary/20">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" className="bg-dark border-gray-700 focus:border-primary text-white" placeholder="Full Name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" className="bg-dark border-gray-700 focus:border-primary text-white" placeholder="your@email.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" className="bg-dark border-gray-700 focus:border-primary text-white" placeholder="How can we help?" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" className="bg-dark border-gray-700 focus:border-primary text-white h-32" placeholder="Tell us more about your inquiry..." />
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-dark-deeper p-8 rounded-xl border border-primary/20 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Our Location</h3>
                    <p className="text-gray-400">Digital Park Tower, Floor 12<br />Dubai Internet City<br />Dubai, UAE</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email Us</h3>
                    <p className="text-gray-400">info@shattara.edu<br />support@shattara.edu</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Call Us</h3>
                    <p className="text-gray-400">+971 4 123 4567<br />+971 50 987 6543</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-deeper p-8 rounded-xl border border-primary/20">
              <h2 className="text-2xl font-semibold mb-6">Specialized Inquiries</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Headphones className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Technical Support</h3>
                    <p className="text-gray-400">support@shattara.edu<br />+971 4 123 4569</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Building className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Partnership Inquiries</h3>
                    <p className="text-gray-400">partnerships@shattara.edu<br />+971 4 123 4570</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <BookOpen className="text-primary size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Educational Resources</h3>
                    <p className="text-gray-400">resources@shattara.edu<br />+971 4 123 4571</p>
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
