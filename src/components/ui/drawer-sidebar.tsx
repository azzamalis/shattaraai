
import React from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

interface DrawerSidebarProps {
  children: React.ReactNode;
}

export function DrawerSidebar({ children }: DrawerSidebarProps) {
  const { openMobile, setOpenMobile } = useSidebar();
  
  return (
    <Drawer open={openMobile} onOpenChange={setOpenMobile}>
      <DrawerTrigger asChild>
        <Button 
          className="fixed top-4 left-4 z-50 md:hidden bg-[#222222] border border-white/20 text-white"
          size="icon"
          variant="outline"
        >
          <PanelLeft size={18} />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90%] bg-[#222222] border-t border-white/20">
        {children}
      </DrawerContent>
    </Drawer>
  );
}
