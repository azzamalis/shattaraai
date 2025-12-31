import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const MembersTab: React.FC = () => {
  const navigate = useNavigate();
  const handleViewTeamPlans = () => {
    navigate('/pricing');
  };
  return <div className="pb-8">
      <div className="space-y-0">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Team Members</span>
            
          </div>
          <div className="flex items-center gap-2 text-primary/50">
            <Users className="h-4 w-4" />
            <span className="text-sm">0</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Pending Invites</span>
            
          </div>
          <div className="flex items-center gap-2 text-primary/50">
            <Mail className="h-4 w-4" />
            <span className="text-sm">0</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Team Plan</span>
            <span className="text-xs text-primary/70">
              Upgrade to share spaces and learning features
            </span>
          </div>
          <Button size="sm" onClick={handleViewTeamPlans} className="h-8 px-3">
            View Plans
          </Button>
        </div>
      </div>
    </div>;
};