import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, History, Crown, LogOut, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useWindowSize } from '@/hooks/use-window-size';
import { SettingsDialog } from '@/components/dashboard/modals/SettingsDialog';

interface NavUserProps {
  onOpenChange: (open: boolean) => void;
}

export const NavUser: React.FC<NavUserProps> = ({ onOpenChange }) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const { user, signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (!error) {
        toast.success('Logged out successfully');
        onOpenChange(false);
        setTimeout(() => {
          navigate('/signin');
        }, 150);
      } else {
        toast.error('Failed to log out');
      }
    } catch (error) {
      toast.error('An error occurred during logout');
    }
  };

  const handleNavigation = (path: string) => {
    // Close drawer first, then navigate after a brief delay
    onOpenChange(false);
    setTimeout(() => {
      navigate(path);
    }, 150);
  };

  const userEmail = user?.email || 'No email';
  const userName = user?.email?.split('@')[0] || 'User';
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between gap-3 hover:bg-accent transition-colors duration-200 py-6 px-2 h-auto data-[state=open]:bg-accent"
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale border-2 border-border">
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium text-foreground">{userName}</span>
            <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
          </div>
          <MoreVertical className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover border-border"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm bg-muted/50">
                <Avatar className="h-8 w-8 rounded-lg border-2 border-border">
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-popover-foreground">{userName}</span>
                  <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-border" />
            
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setTimeout(() => {
                    setSettingsOpen(true);
                  }, 100);
                  onOpenChange(false);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleNavigation('/history')}
              >
                <History className="mr-2 h-4 w-4" />
                <span>History</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem
                className="cursor-pointer relative overflow-hidden bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-400/30 hover:via-yellow-400/30 hover:to-amber-400/30 focus:from-amber-400/30 focus:via-yellow-400/30 focus:to-amber-400/30 transition-all duration-300"
                onClick={() => handleNavigation('/pricing')}
              >
                <Crown className="mr-2 h-4 w-4 text-amber-500" />
                <span className="font-medium">Upgrade Plan</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="bg-border" />
            
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};
