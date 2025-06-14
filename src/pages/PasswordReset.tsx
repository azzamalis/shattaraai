
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AnimatedChatPreview from '@/components/AnimatedChatPreview';

const PasswordReset = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Email required", {
        description: "Please enter your email address."
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error("Password reset failed", {
          description: error.message
        });
      } else {
        toast.success("Reset link sent", {
          description: "Please check your email for instructions to reset your password."
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column - Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-card flex-col p-12">
        <div className="mb-auto">
          <Link to="/" className="inline-block">
            <Logo textColor="text-foreground" />
          </Link>
        </div>
        <div className="mb-auto flex items-center justify-center py-12">
          <AnimatedChatPreview />
        </div>
        <div className="mt-auto">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Shattara AI. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-block">
              <Logo textColor="text-foreground" />
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Reset password</h1>
            <p className="text-muted-foreground">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
          
          {/* Password Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background border-border text-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Remember your password?{' '}
              <Link 
                to="/signin" 
                className="text-foreground font-medium relative after:absolute 
                  after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full 
                  after:bg-foreground after:transition-all after:duration-300"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
