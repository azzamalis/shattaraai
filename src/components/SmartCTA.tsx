
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/Button';
import { cn } from '@/lib/utils';

interface SmartCTAProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  type?: 'signup' | 'login' | 'get-started';
  onClick?: (e?: React.MouseEvent) => void;
}

const SmartCTA: React.FC<SmartCTAProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  type = 'signup',
  onClick
}) => {
  const { user, profile, loading } = useAuth();
  const [targetPath, setTargetPath] = useState<string>('/signup');
  
  useEffect(() => {
    if (!loading) {
      // For login and signup types, ALWAYS go to the respective auth pages first
      // Let the auth pages handle the redirect logic after authentication
      if (type === 'login') {
        setTargetPath('/signin');
        return;
      }
      
      if (type === 'signup') {
        setTargetPath('/signup');
        return;
      }
      
      // Only for 'get-started' type, use smart redirect logic
      if (type === 'get-started') {
        // Only treat as authenticated if both user exists AND profile exists
        if (user && profile) {
          // User is logged in with a valid profile
          if (profile?.onboarding_completed) {
            // User completed onboarding, go to dashboard
            setTargetPath('/dashboard');
          } else {
            // User needs to complete onboarding
            setTargetPath('/onboarding');
          }
        } else {
          // User is not logged in OR doesn't have a profile - treat as non-authenticated
          setTargetPath('/signup');
        }
      }
    }
  }, [user, profile, loading, type]);

  if (loading) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={cn(className, 'opacity-50 cursor-not-allowed')}
        disabled
      >
        {children}
      </Button>
    );
  }

  return (
    <Link to={targetPath} onClick={onClick}>
      <Button variant={variant} size={size} className={className}>
        {children}
      </Button>
    </Link>
  );
};

export default SmartCTA;
