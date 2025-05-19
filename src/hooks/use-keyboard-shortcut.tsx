
import { useEffect } from 'react';

type KeyboardShortcutOptions = {
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

/**
 * Hook to register a keyboard shortcut
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: KeyboardShortcutOptions = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { metaKey, ctrlKey, altKey, shiftKey } = options;
      
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        (metaKey === undefined || event.metaKey === metaKey) &&
        (ctrlKey === undefined || event.ctrlKey === ctrlKey) &&
        (altKey === undefined || event.altKey === altKey) &&
        (shiftKey === undefined || event.shiftKey === shiftKey)
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, options]);
}
