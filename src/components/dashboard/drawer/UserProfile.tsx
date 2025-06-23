
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronUp, Settings, Tag, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface UserProfileProps {
  onOpenChange: (open: boolean) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  onOpenChange
}) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (!error) {
        toast.success('Logged out successfully');
        navigate('/signin');
        onOpenChange(false);
      } else {
        toast.error('Failed to log out');
      }
    } catch (error) {
      toast.error('An error occurred during logout');
    }
  };

  const userEmail = user?.email || 'No email';
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';

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
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-dashboard-text dark:text-dashboard-text">{userEmail}</span>
          </div>
          <ChevronUp size={16} className="text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[240px] bg-popover p-1 mb-1 shadow-md z-[100] pointer-events-auto" 
        align="end" 
        side="top" 
        sideOffset={5}
      >
        <div className="p-4 border-b border-border pointer-events-auto">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground truncate">{userEmail}</span>
          </div>
        </div>
        
        <div className="flex flex-col pointer-events-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" 
            onClick={() => {
              navigate('/profile');
              onOpenChange(false);
            }}
          >
            <Settings size={16} className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" 
            asChild
          >
            <Link to="/pricing">
              <Tag size={16} className="mr-2 h-4 w-4" />
              <span>Pricing</span>
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" 
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
