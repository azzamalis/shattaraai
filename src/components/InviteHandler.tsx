
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useReferrals } from '@/hooks/useReferrals';
import { useToast } from '@/hooks/use-toast';

export function InviteHandler() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trackReferralActivity } = useReferrals();
  const { toast } = useToast();

  useEffect(() => {
    const handleInviteCode = async () => {
      if (!code) {
        navigate('/');
        return;
      }

      // Track the link click
      await trackReferralActivity(code, 'link_clicked', {
        referrer_source: 'direct_link',
        timestamp: new Date().toISOString()
      });

      // Store invite code in localStorage for signup process
      localStorage.setItem('referral_code', code);

      if (user) {
        // User is already logged in, redirect to dashboard
        toast({
          title: "Welcome back!",
          description: "Thanks for using the referral link. You're already signed in!"
        });
        navigate('/dashboard');
      } else {
        // User is not logged in, redirect to signup with referral context
        toast({
          title: "Welcome to Shattara!",
          description: "Complete your signup to get your free month!"
        });
        navigate('/signup?ref=' + code);
      }
    };

    handleInviteCode();
  }, [code, user, navigate, trackReferralActivity, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Processing your invitation...</p>
      </div>
    </div>
  );
}
