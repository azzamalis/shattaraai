import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, HeadphonesIcon, Users, Palette } from 'lucide-react';

export const PlanBillingTab: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const planType = profile?.plan_type || 'free';

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const features = [
    { icon: Sparkles, label: 'Unlimited AI generations' },
    { icon: Crown, label: 'Advanced study tools' },
    { icon: HeadphonesIcon, label: 'Priority support' },
    { icon: Users, label: 'Team collaboration' },
    { icon: Palette, label: 'Custom branding' },
  ];

  return (
    <div className="pb-8">
      <div className="space-y-0">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Current Plan</span>
            <span className="text-xs text-primary/70">
              You are on the <span className="font-semibold capitalize">{planType}</span> plan
            </span>
          </div>
          {planType === 'free' && (
            <Button size="sm" onClick={handleUpgrade} className="h-8 px-3">
              Upgrade
            </Button>
          )}
        </div>

        {planType === 'free' && (
          <>
            <div className="py-3 border-b border-border">
              <span className="text-sm font-medium">Upgrade to unlock</span>
            </div>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0"
              >
                <feature.icon className="h-4 w-4 text-primary/50" />
                <span className="text-sm text-primary/70">{feature.label}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
