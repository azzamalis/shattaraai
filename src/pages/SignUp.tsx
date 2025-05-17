
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  
  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password should be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    const { error } = await signUp(email, password, firstName, lastName);
    
    if (error) {
      console.error('Error signing up:', error);
      if (error.message.includes('email address is already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message || 'Failed to sign up');
      }
      setLoading(false);
    } else {
      toast.success('Sign up successful! Please check your email to confirm your account.');
      navigate('/signin');
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
            <h1 className="mt-6 text-3xl font-bold">Create an account</h1>
            <p className="mt-2 text-gray-400">Sign up to get started</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input 
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="bg-[#1A1A1A] border-white/10 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input 
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="bg-[#1A1A1A] border-white/10 text-white"
                  />
                </div>
              </div>
              
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
              
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#1A1A1A] border-white/10 text-white"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">Must be at least 6 characters</p>
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
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
            
            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
