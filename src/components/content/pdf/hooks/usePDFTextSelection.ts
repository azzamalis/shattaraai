
import { useCallback, useEffect } from 'react';
import { TextActionPosition } from '../types';

interface UsePDFTextSelectionProps {
  containerRef: React.RefObject<HTMLDivElement>;
  setSelectedText: (text: string) => void;
  setTextActionPosition: (position: TextActionPosition | null) => void;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
}

export function usePDFTextSelection({
  containerRef,
  setSelectedText,
  setTextActionPosition,
  onTextAction,
}: UsePDFTextSelectionProps) {
  const handleTextSelection = useCallback((event: MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const text = selection.toString().trim();
      if (text.length > 2) {
        setSelectedText(text);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTextActionPosition({ 
            x: event.clientX - rect.left, 
            y: event.clientY - rect.top - 60 
          });
        }
      }
    } else {
      setSelectedText('');
      setTextActionPosition(null);
    }
  }, [containerRef, setSelectedText, setTextActionPosition]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleMouseUp = (e: MouseEvent) => handleTextSelection(e);
      const handleClickOutside = (e: MouseEvent) => {
        if (!container.contains(e.target as Node)) {
          setSelectedText('');
          setTextActionPosition(null);
        }
      };

      container.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('click', handleClickOutside);
      
      return () => {
        container.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [handleTextSelection, containerRef, setSelectedText, setTextActionPosition]);

  const handleTextAction = useCallback((action: 'explain' | 'search' | 'summarize', selectedText: string) => {
    if (selectedText && onTextAction) {
      onTextAction(action, selectedText);
    }
    setSelectedText('');
    setTextActionPosition(null);
  }, [onTextAction, setSelectedText, setTextActionPosition]);

  return {
    handleTextAction,
  };
}
