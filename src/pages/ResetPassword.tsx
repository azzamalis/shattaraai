import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import AnimatedChatPreview from '@/components/AnimatedChatPreview';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // Check if we have the necessary parameters from the email link
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      toast.error("Reset link invalid", {
        description: errorDescription || "The reset link is invalid or has expired. Please request a new one."
      });
      navigate('/password-reset');
      return;
    }

    // Handle both token formats: new format with access_token/refresh_token and old format with token
    const token = searchParams.get('token');
    
    if (type === 'recovery' && (accessToken || token)) {
      setIsValidToken(true);
      
      // If we have access_token and refresh_token, set the session
      if (accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
      }
      // For token format, it will be handled automatically by Supabase
    } else {
      toast.error("Reset link invalid", {
        description: "The reset link is invalid or has expired. Please request a new one."
      });
      navigate('/password-reset');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error("All fields required", {
        description: "Please fill in both password fields."
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure both password fields match."
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters long."
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        toast.error("Password reset failed", {
          description: error.message
        });
      } else {
        toast.success("Password updated successfully", {
          description: "You can now sign in with your new password."
        });
        navigate('/signin');
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="flex min-h-screen bg-background">
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
            <p className="text-sm text-foreground/60">
              © {new Date().getFullYear()} Shattara AI. All rights reserved.
            </p>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-background">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8">
              <Link to="/" className="inline-block">
                <Logo textColor="text-foreground" />
              </Link>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-foreground">Invalid Reset Link</h1>
              <p className="text-foreground/70 mb-6">
                The reset link is invalid or has expired. Please request a new one.
              </p>
              
              <Link to="/password-reset">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Request New Reset Link
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="text-sm text-foreground/60">
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
            <h1 className="text-3xl font-bold mb-2 text-foreground">Set new password</h1>
            <p className="text-foreground/70">
              Enter your new password below to complete the reset process.
            </p>
          </div>
          
          {/* Password Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">New Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter new password" 
                className="bg-background border-border text-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm new password" 
                className="bg-background border-border text-foreground"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-foreground/70 text-sm">
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

export default ResetPassword;