
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
    <div className="p-6 bg-dashboard-bg dark:bg-dashboard-bg shrink-0">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center justify-between w-full text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover p-3 rounded-lg border border-dashboard-separator dark:border-dashboard-separator"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <User size={16} />
              </div>
              <div className="overflow-hidden text-left">
                <p className="truncate text-sm font-medium text-dashboard-text dark:text-dashboard-text">Free Plan</p>
                <p className="truncate text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary">azzamalis@icloud.com</p>
              </div>
            </div>
            <ChevronUp size={16} className="text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] bg-dashboard-card dark:bg-dashboard-card border border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text p-0 mb-1 z-50" align="end" side="top" sideOffset={5}>
          <div className="p-3 border-b border-dashboard-separator dark:border-dashboard-separator">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium text-dashboard-text dark:text-dashboard-text">Free Plan</p>
              </div>
            </div>
          </div>
          
          <div className="py-1">
            <Button variant="ghost" className="w-full justify-start px-3 py-2 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text" onClick={() => {
            navigate('/profile');
            onOpenChange(false);
          }}>
              <Settings size={16} className="mr-3 text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
              <span>Settings</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start px-3 py-2 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text" asChild>
              <Link to="/pricing">
                <Tag size={16} className="mr-3 text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
                <span>Pricing</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start px-3 py-2 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text" onClick={handleLogout}>
              <LogOut size={16} className="mr-3 text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
              <span>Log out</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
