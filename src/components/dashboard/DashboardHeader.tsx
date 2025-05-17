
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Menu, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/components/Logo';
import { CommandModal } from './CommandModal';
import { UpgradeModal } from './UpgradeModal';

interface DashboardHeaderProps {
  onOpenDrawer: () => void;
}

export function DashboardHeader({ onOpenDrawer }: DashboardHeaderProps) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const userInitials = profile?.first_name && profile?.last_name 
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <header className="flex items-center bg-[#222222] p-4 sticky top-0 z-10">
      <div className="grid grid-cols-3 w-full items-center">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenDrawer} 
            className="text-white hover:bg-white/10 hover:text-primary"
          >
            <Menu size={22} />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Logo className="h-8 w-auto" textColor="text-white" />
        </div>
        
        {/* Center section - empty */}
        <div></div>
        
        {/* Right section */}
        <div className="flex justify-end items-center gap-3 pr-2">
          {/* Upgrade button */}
          <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-transparent border-2 border-primary text-primary hover:text-primary hover:bg-primary/5 transition-all rounded-full px-6 py-5 h-9 shadow-[0_2px_8px_rgba(var(--primary),0.25)] hover:shadow-[0_2px_12px_rgba(var(--primary),0.35)]"
              >
                Upgrade
              </Button>
            </DialogTrigger>
            <UpgradeModal onClose={() => setUpgradeOpen(false)} />
          </Dialog>

          {/* Command button */}
          <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#1A1A1A] border-none text-gray-400 hover:text-white hover:bg-[#252525] rounded-full px-6 py-5 h-9 flex items-center justify-center gap-1.5 min-w-[120px]"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm font-medium mx-0.5">⌘</span>
                <span className="text-sm font-medium">K</span>
              </Button>
            </DialogTrigger>
            <CommandModal open={commandOpen} onOpenChange={setCommandOpen} />
          </Dialog>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border border-white/10">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.first_name || user?.email || "User"} />
                  <AvatarFallback className="bg-[#1A1A1A] text-white">{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#1A1A1A] border border-white/10 text-white" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-xs text-gray-400 leading-none">Signed in as</p>
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-primary/10 focus:bg-primary/10 hover:text-white focus:text-white cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-primary/10 focus:bg-primary/10 hover:text-white focus:text-white cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="hover:bg-primary/10 focus:bg-primary/10 hover:text-white focus:text-white cursor-pointer" 
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
