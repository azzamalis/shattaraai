import React, { createContext, useContext, useState, useCallback } from 'react';

interface PopoverContextType {
  openPopoverId: string | null;
  openPopover: (id: string) => void;
  closePopover: (id: string) => void;
  isPopoverOpen: (id: string) => boolean;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export function PopoverProvider({ children }: { children: React.ReactNode }) {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const openPopover = useCallback((id: string) => {
    setOpenPopoverId(id);
  }, []);

  const closePopover = useCallback((id: string) => {
    setOpenPopoverId((current) => current === id ? null : current);
  }, []);

  const isPopoverOpen = useCallback((id: string) => {
    return openPopoverId === id;
  }, [openPopoverId]);

  return (
    <PopoverContext.Provider value={{ openPopoverId, openPopover, closePopover, isPopoverOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function usePopoverState() {
  const context = useContext(PopoverContext);
  if (context === undefined) {
    throw new Error('usePopoverState must be used within a PopoverProvider');
  }
  return context;
}
