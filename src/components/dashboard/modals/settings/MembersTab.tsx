import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MembersTab: React.FC = () => {
  const navigate = useNavigate();

  const handleViewTeamPlans = () => {
    navigate('/pricing');
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Teams</h3>
      <p className="text-sm text-primary/70 mb-1 max-w-md">
        Upgrade to a team plan to share spaces and learning features.
      </p>
      <p className="text-xs text-muted-foreground mb-6 max-w-md">
        If someone invites you to their team, you'll receive an email notification with instructions to join.
      </p>
      <Button onClick={handleViewTeamPlans}>
        View Team Plans
      </Button>
    </div>
  );
};
