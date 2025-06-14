
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Logo from '@/components/Logo';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, user, profile, loading, recentLogout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    acceptTerms: false
  });

  useEffect(() => {
    if (!loading && user && !recentLogout) {
      // Check if user has completed onboarding
      if (profile?.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, profile, loading, navigate, recentLogout]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, acceptTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.acceptTerms) {
      toast.error("Please complete all fields", {
        description: "All fields are required to create an account."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.name);
      
      if (error) {
        toast.error("Sign up failed", {
          description: error.message
        });
      } else {
        toast.success("Account created successfully!", {
          description: "Please check your email to verify your account."
        });
        
        // Navigate to onboarding page
        navigate('/onboarding');
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast.error("Google sign up failed", {
          description: error.message
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-dark items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
          <h2 className="text-4xl font-bold mb-6 text-white">Revolutionize your learning experience</h2>
          <p className="text-lg text-gray-400 mb-6">
            Join thousands of students using Shattara AI to accelerate their learning and achieve better results through personalized AI-powered education.
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
            <h1 className="text-3xl font-bold mb-2 text-white">Create an account</h1>
            <p className="text-gray-400">Start your personalized learning journey today.</p>
          </div>
          
          {/* Google Sign-up Button */}
          <Button 
            variant="outline" 
            className="w-full mb-6 bg-transparent border-zinc-700 hover:bg-zinc-800 text-white hover:text-white"
            onClick={handleGoogleSignUp}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Continue with Google
          </Button>
          
          {/* Separator */}
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-zinc-700"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">or continue with email</span>
            <div className="flex-grow border-t border-zinc-700"></div>
          </div>
          
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Enter your name" 
                className="bg-dark border-zinc-700 text-white"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="bg-dark border-zinc-700 text-white"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password" 
                  className="bg-dark border-zinc-700 text-white pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400">Must be at least 6 characters</p>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                className="border-zinc-700 data-[state=checked]:bg-primary mt-1"
                checked={formData.acceptTerms}
                onCheckedChange={handleCheckboxChange}
                required
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-400 leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{' '}
                <Link 
                  to="/terms" 
                  className="text-white font-medium relative after:absolute 
                    after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full 
                    after:bg-white after:transition-all after:duration-300"
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link 
                  to="/privacy" 
                  className="text-white font-medium relative after:absolute 
                    after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full 
                    after:bg-white after:transition-all after:duration-300"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-light text-white py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link 
                to="/signin" 
                className="text-white font-medium relative after:absolute 
                  after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full 
                  after:bg-white after:transition-all after:duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
