
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword, user } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    const { error } = await resetPassword(email);
    
    if (error) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to reset password');
      setLoading(false);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#111] text-white">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <Logo className="h-12 w-auto mx-auto" textColor="text-white" />
            </Link>
            <h1 className="mt-6 text-3xl font-bold">Reset password</h1>
            <p className="mt-2 text-gray-400">Enter your email to receive a password reset link</p>
          </div>
          
          {submitted ? (
            <div className="mt-8 space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold">Check your email</h2>
              <p className="text-gray-400">
                We've sent a password reset link to <span className="text-white">{email}</span>. 
                Please check your inbox and follow the instructions.
              </p>
              <Button asChild className="mt-6 w-full bg-primary hover:bg-primary-light">
                <Link to="/signin">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="bg-[#1A1A1A] border-white/10 text-white"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-light" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                Remember your password?{' '}
                <Link to="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
