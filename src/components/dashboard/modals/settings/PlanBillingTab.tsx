import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';


export const PlanBillingTab: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const planType = profile?.plan_type || 'free';

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Current Plan</h3>
          <p className="text-sm text-primary/70 mt-1">
            You are currently on the <span className="font-semibold capitalize">{planType}</span> plan
          </p>
        </div>
        {planType === 'free' && (
          <Button onClick={handleUpgrade}>
            Upgrade Plan
          </Button>
        )}
      </div>

      {planType === 'free' && (
        <div className="border border-border rounded-lg p-4 bg-muted/20">
          <h4 className="text-sm font-medium mb-2">Upgrade to unlock:</h4>
          <ul className="text-sm text-primary/70 space-y-2">
            <li>• Unlimited AI generations</li>
            <li>• Advanced study tools</li>
            <li>• Priority support</li>
            <li>• Team collaboration</li>
            <li>• Custom branding</li>
          </ul>
        </div>
      )}
    </div>
  );
};
