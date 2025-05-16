
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Settings, Tag, History, LogOut, ChevronUp } from 'lucide-react';

interface ProfilePopoverProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function ProfilePopover({ darkMode, setDarkMode }: ProfilePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center justify-between w-full text-white hover:bg-white/10 p-2 rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-[#ea384c]">
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden text-left">
              <p className="truncate text-sm font-medium text-white">Azzam Sahlil</p>
              <p className="truncate text-xs text-gray-400">Free Plan</p>
            </div>
          </div>
          <ChevronUp size={16} className="text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] bg-[#1A1A1A] border border-white/10 text-white p-0 mb-1 z-50" align="end" side="top" sideOffset={5}>
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-[#ea384c]">
              <AvatarFallback className="text-black">A</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Azzam Sahlil</p>
            </div>
          </div>
        </div>
        
        <div className="py-1">
          <Button variant="ghost" className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:text-white">
            <Settings size={16} className="mr-3 text-gray-300" />
            <span>Settings</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:text-white">
            <Tag size={16} className="mr-3 text-gray-300" />
            <span>Pricing</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:text-white">
            <History size={16} className="mr-3 text-gray-300" />
            <span>History</span>
          </Button>
          <div className="flex items-center px-3 py-2 hover:bg-white/10 cursor-pointer text-white">
            <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-primary mr-3" />
            <span className="text-sm">Dark mode</span>
          </div>
          <Button variant="ghost" className="w-full justify-start px-3 py-2 text-white hover:bg-white/10 hover:text-white">
            <LogOut size={16} className="mr-3 text-gray-300" />
            <span>Log out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
