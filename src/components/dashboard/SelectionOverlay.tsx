
import React from 'react';
import { cn } from '@/lib/utils';

interface SelectionOverlayProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export function SelectionOverlay({ isVisible, children }: SelectionOverlayProps) {
  if (!isVisible) return <>{children}</>;

  return (
    <div className="relative">
      {/* Page overlay - dims everything except the content area */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      
      {/* Content area that remains interactive */}
      <div className="relative z-50">
        {children}
      </div>
    </div>
  );
}
