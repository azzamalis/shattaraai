
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

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
    <div className="flex min-h-screen bg-dark">
      {/* Left Column - Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-deeper flex-col p-12">
        <div className="mb-auto">
          <Link to="/" className="inline-block">
            <Logo textColor="text-white" />
          </Link>
        </div>
        <div className="mb-auto">
          <h2 className="text-4xl font-bold mb-6 text-white">Forgot your password?</h2>
          <p className="text-lg text-gray-400 mb-6">
            No worries, it happens to everyone. We'll send you a secure link to reset your password and get you back on track.
          </p>
        </div>
        <div className="mt-auto">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Shattara AI. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-dark">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-block">
              <Logo textColor="text-white" />
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Reset password</h1>
            <p className="text-gray-400">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
          
          {/* Password Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="bg-dark border-zinc-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-light text-white py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Remember your password?{' '}
              <Link 
                to="/signin" 
                className="text-white font-medium relative after:absolute 
                  after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full 
                  after:bg-white after:transition-all after:duration-300"
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
