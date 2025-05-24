
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronUp, Settings, Tag, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserProfileProps {
  onOpenChange: (open: boolean) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  onOpenChange
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('hasSeenTutorial');
    onOpenChange(false);
    toast.success("Logged out successfully", {
      description: "You have been logged out of your account."
    });
    navigate('/');
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-dashboard-separator p-4 bg-dashboard-sidebar">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex items-center justify-between w-full dashboard-text hover:bg-dashboard-card-hover p-2 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 bg-[#ea384c]">
                <AvatarFallback className="text-black">A</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden text-left">
                <p className="truncate text-sm font-medium dashboard-text">Azzam Sahlil</p>
                <p className="truncate text-xs dashboard-text-secondary">Free Plan</p>
              </div>
            </div>
            <ChevronUp size={16} className="dashboard-text-secondary" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] bg-dashboard-card border border-dashboard-separator dashboard-text p-0 mb-1 z-50" align="end" side="top" sideOffset={5}>
          <div className="p-3 border-b border-dashboard-separator">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-[#ea384c]">
                <AvatarFallback className="text-black hover:text-black">A</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Azzam Sahlil</p>
              </div>
            </div>
          </div>
          
          <div className="py-1">
            <Button variant="ghost" className="w-full justify-start px-3 py-2 dashboard-text hover:bg-dashboard-card-hover hover:!text-dashboard-text" onClick={() => {
            navigate('/profile');
            onOpenChange(false);
          }}>
              <Settings size={16} className="mr-3 dashboard-text-secondary" />
              <span>Settings</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start px-3 py-2 dashboard-text hover:bg-dashboard-card-hover hover:!text-dashboard-text" asChild>
              <Link to="/pricing">
                <Tag size={16} className="mr-3 dashboard-text-secondary" />
                <span>Pricing</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start px-3 py-2 dashboard-text hover:bg-dashboard-card-hover hover:!text-dashboard-text" onClick={handleLogout}>
              <LogOut size={16} className="mr-3 dashboard-text-secondary" />
              <span>Log out</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
