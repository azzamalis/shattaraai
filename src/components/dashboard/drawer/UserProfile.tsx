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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover transition-colors duration-200 py-2 px-2"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User size={16} />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-dashboard-text dark:text-dashboard-text">azzamalis@icloud.com</span>
          </div>
          <ChevronUp size={16} className="text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[250px] bg-dashboard-card dark:bg-dashboard-card border border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text p-0 mb-1" 
        align="end" 
        side="top" 
        sideOffset={5}
      >
        <div className="p-4 border-b border-dashboard-separator dark:border-dashboard-separator">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User size={16} />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-dashboard-text dark:text-dashboard-text">azzamalis@icloud.com</span>
          </div>
        </div>
        
        <div className="py-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start px-4 py-2.5 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text" 
            onClick={() => {
              navigate('/profile');
              onOpenChange(false);
            }}
          >
            <Settings size={16} className="mr-3 text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
            <span>Settings</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start px-4 py-2.5 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text" 
            asChild
          >
            <Link to="/pricing">
              <Tag size={16} className="mr-3 text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
              <span>Pricing</span>
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start px-4 py-2.5 text-red-500 hover:text-red-500 hover:bg-red-500/10" 
            onClick={() => {
              toast.success('Logged out successfully');
              navigate('/login');
            }}
          >
            <LogOut size={16} className="mr-3" />
            <span>Log Out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
