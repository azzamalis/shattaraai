import React, { useState } from 'react';
import ContactHero from '@/components/hero/page-specific/ContactHero';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Mail, Phone, MessageCircle, Headphones, BookOpen, Building, Loader2 } from 'lucide-react';
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });
      if (error) {
        throw error;
      }
      toast.success("Thank you for your message. We'll get back to you within 24-48 hours.");
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error sending contact form:', error);
      toast.error("There was an error sending your message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-background text-foreground">
      <ContactHero />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div id="contact-form" className="bg-card p-8 rounded-xl border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-card-foreground">Your Name *</Label>
                <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="bg-background border-input text-foreground focus-visible:border-primary" placeholder="Full Name" disabled={isSubmitting} />
                {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">Email Address *</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="bg-background border-input text-foreground focus-visible:border-primary" placeholder="your@email.com" disabled={isSubmitting} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-card-foreground">Subject *</Label>
                <Input id="subject" value={formData.subject} onChange={e => handleInputChange('subject', e.target.value)} className="bg-background border-input text-foreground focus-visible:border-primary" placeholder="How can we help?" disabled={isSubmitting} />
                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-card-foreground">Message *</Label>
                <Textarea id="message" value={formData.message} onChange={e => handleInputChange('message', e.target.value)} className="bg-background border-input text-foreground h-32 resize-none focus-visible:border-primary" placeholder="Tell us more about your inquiry..." disabled={isSubmitting} />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full relative">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
          
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-xl border border-border mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="text-muted-foreground size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground text-2xl">Our Location</h3>
                    <p className="text-muted-foreground">Madinah Main Highway Road<br />Al Faisaliyah District<br />Jeddah, KSA</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="text-muted-foreground size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground text-2xl">Email Us</h3>
                    <p className="text-muted-foreground">hello@shattaraai.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="text-muted-foreground size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground text-2xl">Call Us</h3>
                    <p className="text-muted-foreground">+966 53 481 4860</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Specialized Inquiries</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center mr-4 flex-shrink-0">
                    <Headphones className="text-muted-foreground size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground text-2xl">Technical Support</h3>
                    <p className="text-muted-foreground">hello@shattaraai.com<br />+966 53 481 4860</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center mr-4 flex-shrink-0">
                    <Building className="text-muted-foreground size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground text-2xl">Partnership Inquiries</h3>
                    <p className="text-muted-foreground">hello@shattaraai.com<br />+966 53 481 4860</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center mr-4 flex-shrink-0">
                    <BookOpen className="text-muted-foreground size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-foreground text-2xl">Educational Resources</h3>
                    <p className="text-muted-foreground">hello@shattaraai.com<br />+966 53 481 4860</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default Contact;