import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Box } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function NewFeaturePromo() {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="bg-transparent hover:bg-white/10 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#00A3FF]/20 text-[#00A3FF] font-medium text-xs px-2 py-0.5 pointer-events-none">
                NEW
              </Badge>
              <span>Practice with exams</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] bg-[#1A1A1A] border border-white/10 text-white p-0" align="center" sideOffset={5}>
          <div className="py-2 px-1">
            <div className="px-2 py-1.5 text-sm font-medium text-gray-400">Choose a Room</div>
            <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm text-white hover:bg-white/10 hover:!text-white group">
              <Box size={16} className="mr-2 text-gray-300 group-hover:text-white" />
              <span>Azzam's Room</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm text-white hover:bg-white/10 hover:!text-white group">
              <Box size={16} className="mr-2 text-gray-300 group-hover:text-white" />
              <span>Project 'Neom'</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm text-white hover:bg-white/10 hover:!text-white group">
              <Box size={16} className="mr-2 text-gray-300 group-hover:text-white" />
              <span>Untitled Room</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
