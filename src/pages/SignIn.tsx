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
import AnimatedChatPreview from '@/components/AnimatedChatPreview';

// Validation functions
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return "Email is required";
  }
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
};

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, user, profile, loading, recentLogout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
    setFormData(prev => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      toast.error("Invalid email", {
        description: emailError
      });
      return;
    }
    
    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast.error("Invalid password", {
        description: passwordError
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast.error("Sign in failed", {
          description: error.message
        });
      } else {
        toast.success("Signed in successfully!", {
          description: "Welcome back to Shattara AI!"
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

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast.error("Google sign in failed", {
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
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-foreground">Loading...</div>
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
            <h1 className="text-3xl font-bold mb-2 text-foreground">Sign in</h1>
            <p className="text-foreground/70">Welcome back! Please enter your details.</p>
          </div>
          
          {/* Google Sign-in Button */}
          <Button 
            variant="outline" 
            className="w-full mb-6 bg-background border-border hover:bg-card 
              text-foreground hover:text-foreground transition-all duration-200"
            onClick={handleGoogleSignIn}
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
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-foreground/60 text-sm">or continue with email</span>
            <div className="flex-grow border-t border-border"></div>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background border-border text-foreground" 
                value={formData.email} 
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Link 
                  to="/password-reset" 
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="bg-background border-border text-foreground pr-10" 
                  value={formData.password} 
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/70 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                className="border-border data-[state=checked]:bg-primary" 
                checked={formData.rememberMe} 
                onCheckedChange={handleCheckboxChange} 
              />
              <label 
                htmlFor="remember" 
                className="text-sm text-foreground/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-foreground/70 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-foreground font-medium relative after:absolute 
                  after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full 
                  after:bg-foreground after:transition-all after:duration-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
