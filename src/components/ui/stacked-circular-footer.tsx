import React, { useState } from 'react';
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Instagram, Linkedin, Twitter, Loader2 } from "lucide-react";
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
function StackedCircularFooter() {
  const currentYear = new Date().getFullYear();
  const {
    toast
  } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive"
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('newsletter-subscribe', {
        body: {
          email: email.trim().toLowerCase()
        }
      });
      if (error) {
        // Check if it's a 409 conflict (already subscribed)
        if (error.message && error.message.includes('already subscribed')) {
          toast({
            title: "Already Subscribed!",
            description: "You're already subscribed to our newsletter. Thank you!"
          });
          setEmail(''); // Clear the form
          return;
        }
        throw error;
      }
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for subscribing! Check your email for a welcome message."
      });
      setEmail(''); // Clear the form
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);

      // Handle specific error messages from the backend
      const errorMessage = error.message || "Failed to subscribe to newsletter. Please try again later.";
      toast({
        title: "Subscription Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <footer className="bg-background text-foreground py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div style={{
          width: '200px',
          height: '200px'
        }} className="mb-8 rounded-full p-6 flex items-center justify-center bg-transparent py-[10px]">
            <Logo textColor="text-foreground" className="scale-125" />
          </div>
          
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <Link to="/team" className="text-muted-foreground hover:text-primary transition-colors">The Team</Link>
            <Link to="/teachers" className="text-muted-foreground hover:text-primary transition-colors">For Teachers</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
          </nav>
          
          <div className="flex gap-4 mb-8">
            <a href="https://facebook.com/shattaraai" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent hover:bg-primary hover:border-primary group">
                <Facebook className="h-4 w-4 text-foreground group-hover:text-primary-foreground" />
                <span className="sr-only">Facebook</span>
              </Button>
            </a>
            <a href="https://twitter.com/shattaraai" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent hover:bg-primary hover:border-primary group">
                <Twitter className="h-4 w-4 text-foreground group-hover:text-primary-foreground" />
                <span className="sr-only">Twitter</span>
              </Button>
            </a>
            <a href="https://instagram.com/shattaraai" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent hover:bg-primary hover:border-primary group">
                <Instagram className="h-4 w-4 text-foreground group-hover:text-primary-foreground" />
                <span className="sr-only">Instagram</span>
              </Button>
            </a>
            <a href="https://linkedin.com/company/shattaraai" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent hover:bg-primary hover:border-primary group">
                <Linkedin className="h-4 w-4 text-foreground group-hover:text-primary-foreground" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </a>
          </div>
          
          <div className="mb-8 w-full max-w-md">
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <div className="flex-grow">
                <Label htmlFor="newsletter-email" className="sr-only">Email</Label>
                <Input id="newsletter-email" placeholder="Enter your email" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting} className="rounded-full bg-background border-border focus:border-primary focus:ring-0 focus:ring-offset-0 text-foreground" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 relative">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} SHATTARA AI — BUILT BY PEOPLE, POWERED BY MACHINES.
            </p>
          </div>
        </div>
      </div>
    </footer>;
}
export { StackedCircularFooter };