import React from 'react';
import { ChevronDown, ZoomIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useUnifiedDocument } from './UnifiedDocumentContext';

const zoomLevels = [25, 50, 75, 100, 125, 150, 200, 300, 400, 500];

export function ZoomDropdown() {
  const { zoom, setZoomLevel, fitToWidth, fitToPage } = useUnifiedDocument();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 gap-1 hover:bg-muted/50"
        >
          <ZoomIn className="h-4 w-4" />
          <span className="text-xs font-mono min-w-[3ch] text-right">
            {Math.round(zoom)}%
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="center" 
        className="w-32 bg-background border-border shadow-lg"
      >
        <DropdownMenuItem 
          onClick={fitToPage}
          className="text-xs hover:bg-muted/50"
        >
          Fit to Page
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={fitToWidth}
          className="text-xs hover:bg-muted/50"
        >
          Fit to Width
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {zoomLevels.map((level) => (
          <DropdownMenuItem
            key={level}
            onClick={() => setZoomLevel(level)}
            className={`text-xs hover:bg-muted/50 ${
              Math.round(zoom) === level ? 'bg-muted text-primary' : ''
            }`}
          >
            {level}%
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}