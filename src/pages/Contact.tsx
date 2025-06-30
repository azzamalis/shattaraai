import React, { useState } from 'react';
import ContactHero from '@/components/hero/page-specific/ContactHero';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle,
  Headphones,
  BookOpen,
  Building,
  Loader2
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your message. We'll get back to you within 24-48 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error: any) {
      console.error('Error sending contact form:', error);
      toast({
        title: "Failed to Send Message",
        description: "There was an error sending your message. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#FAFAFA]">
      <ContactHero />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FAFAFA]">Get in Touch</h1>
          <p className="text-xl text-[#9A9A9A] max-w-3xl mx-auto">
            Have questions about our platform? Looking to partner with us? 
            Our team is ready to help you transform education with AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div id="contact-form" className="bg-[#141414] p-8 rounded-xl border border-[#2E2E2E]">
            <h2 className="text-2xl font-semibold mb-6 text-[#FAFAFA]">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#FAFAFA]">Your Name *</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-[#121212] border-[#2E2E2E] focus:border-[#E3E3E3] text-[#FAFAFA]" 
                  placeholder="Full Name"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#FAFAFA]">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-[#121212] border-[#2E2E2E] focus:border-[#E3E3E3] text-[#FAFAFA]" 
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-[#FAFAFA]">Subject *</Label>
                <Input 
                  id="subject" 
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="bg-[#121212] border-[#2E2E2E] focus:border-[#E3E3E3] text-[#FAFAFA]" 
                  placeholder="How can we help?"
                  disabled={isSubmitting}
                />
                {errors.subject && (
                  <p className="text-sm text-red-400">{errors.subject}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#FAFAFA]">Message *</Label>
                <Textarea 
                  id="message" 
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="bg-[#121212] border-[#2E2E2E] focus:border-[#E3E3E3] text-[#FAFAFA] h-32 resize-none" 
                  placeholder="Tell us more about your inquiry..."
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-sm text-red-400">{errors.message}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#E3E3E3] text-[#171717] hover:bg-[#E3E3E3]/90 relative"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
          
          <div className="space-y-8">
            <div className="bg-[#141414] p-8 rounded-xl border border-[#2E2E2E] mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-[#FAFAFA]">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-[#E3E3E3]/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="text-[#E3E3E3] size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-[#FAFAFA]">Our Location</h3>
                    <p className="text-[#9A9A9A]">Madinah Main Highway Road<br />Al Faisaliyah District<br />Jeddah, KSA</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-[#E3E3E3]/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="text-[#E3E3E3] size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-[#FAFAFA]">Email Us</h3>
                    <p className="text-[#9A9A9A]">hello@shattaraai.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-[#E3E3E3]/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="text-[#E3E3E3] size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-[#FAFAFA]">Call Us</h3>
                    <p className="text-[#9A9A9A]">+966 53 481 4860<br />+966 55 895 71721</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#141414] p-8 rounded-xl border border-[#2E2E2E]">
              <h2 className="text-2xl font-semibold mb-6 text-[#FAFAFA]">Specialized Inquiries</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-[#E3E3E3]/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Headphones className="text-[#E3E3E3] size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-[#FAFAFA]">Technical Support</h3>
                    <p className="text-[#9A9A9A]">hello@shattaraai.com<br />+966 53 481 4860</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-[#E3E3E3]/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Building className="text-[#E3E3E3] size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-[#FAFAFA]">Partnership Inquiries</h3>
                    <p className="text-[#9A9A9A]">hello@shattaraai.com<br />+966 53 481 4860</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-[#E3E3E3]/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <BookOpen className="text-[#E3E3E3] size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-[#FAFAFA]">Educational Resources</h3>
                    <p className="text-[#9A9A9A]">hello@shattaraai.com<br />+966 53 481 4860</p>
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
