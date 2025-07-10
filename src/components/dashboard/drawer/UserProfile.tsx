import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronUp, Settings, Crown, LogOut, User } from 'lucide-react';
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
  const {
    user,
    signOut
  } = useAuth();
  const handleLogout = async () => {
    try {
      const {
        error
      } = await signOut();
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
  return <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-full flex items-center justify-between hover:bg-accent transition-colors duration-200 py-2 px-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground truncate max-w-[140px]">{userEmail}</span>
          </div>
          <ChevronUp size={16} className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[240px] bg-popover p-1 mb-1 shadow-md z-[100] pointer-events-auto" align="end" side="top" sideOffset={5}>
        <div className="p-4 border-b border-border pointer-events-auto">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground truncate max-w-[160px]">{userEmail}</span>
          </div>
        </div>
        
        <div className="flex flex-col pointer-events-auto">
          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" onClick={() => {
          navigate('/profile');
          onOpenChange(false);
        }}>
            <Settings size={16} className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Button>
          
          <Button variant="ghost" className="relative w-full justify-start text-foreground rounded-md px-3 py-2 text-sm font-normal overflow-hidden border-2 border-transparent bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 animate-[spin_3s_linear_infinite] hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 hover:text-black hover:animate-pulse transition-all duration-300" asChild>
            <Link to="/pricing" className="relative z-10">
              <Crown size={16} className="mr-2 h-4 w-4 text-amber-500 hover:text-black transition-colors duration-300" />
              <span className="relative z-10">Upgrade</span>
            </Link>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" onClick={handleLogout}>
            <LogOut size={16} className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>;
};