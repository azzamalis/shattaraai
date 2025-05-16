
import React from 'react';
import { ProfilePopover } from './ProfilePopover';

interface DrawerFooterProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function DrawerFooter({ darkMode, setDarkMode }: DrawerFooterProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-white/20 p-4 bg-[#222222]">
      <ProfilePopover darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}
