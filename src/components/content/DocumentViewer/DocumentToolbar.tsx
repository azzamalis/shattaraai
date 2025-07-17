import React from 'react';
import { ContentData } from '@/pages/ContentPage';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  Columns,
  Copy,
  Type,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentToolbarProps {
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  viewMode: 'single' | 'continuous' | 'two-page';
  onViewModeChange: (mode: 'single' | 'continuous' | 'two-page') => void;
  contentData: ContentData;
}

export function DocumentToolbar({
  zoomLevel,
  onZoomChange,
  viewMode,
  onViewModeChange,
  contentData
}: DocumentToolbarProps) {
  const zoomOptions = [25, 50, 75, 100, 125, 150, 200];
  
  const handleZoomIn = () => {
    const currentIndex = zoomOptions.indexOf(zoomLevel);
    const nextIndex = Math.min(currentIndex + 1, zoomOptions.length - 1);
    onZoomChange(zoomOptions[nextIndex]);
  };

  const handleZoomOut = () => {
    const currentIndex = zoomOptions.indexOf(zoomLevel);
    const prevIndex = Math.max(currentIndex - 1, 0);
    onZoomChange(zoomOptions[prevIndex]);
  };

  const handleZoomReset = () => {
    onZoomChange(100);
  };

  const handleFitToWidth = () => {
    onZoomChange(125); // Approximate fit to width
  };

  const canZoomIn = zoomLevel < zoomOptions[zoomOptions.length - 1];
  const canZoomOut = zoomLevel > zoomOptions[0];

  return (
    <div className="flex items-center justify-between p-2 bg-muted/30 border-b">
      {/* Left: Zoom Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={!canZoomOut}
            className="h-7 w-7 p-0"
            title="Zoom out"
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          
          <Select
            value={zoomLevel.toString()}
            onValueChange={(value) => {
              if (value === 'fit-width') {
                handleFitToWidth();
              } else if (value === 'fit-page') {
                onZoomChange(75);
              } else {
                onZoomChange(parseInt(value));
              }
            }}
          >
            <SelectTrigger className="w-20 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {zoomOptions.map(zoom => (
                <SelectItem key={zoom} value={zoom.toString()}>
                  {zoom}%
                </SelectItem>
              ))}
              <Separator className="my-1" />
              <SelectItem value="fit-width">Fit Width</SelectItem>
              <SelectItem value="fit-page">Fit Page</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={!canZoomIn}
            className="h-7 w-7 p-0"
            title="Zoom in"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-5" />

        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomReset}
          className="h-7 px-2 text-xs"
          title="Reset zoom"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Center: View Mode Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'single' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('single')}
            className="h-7 px-2 text-xs"
            title="Single page"
          >
            <Eye className="h-3 w-3" />
          </Button>
          
          <Button
            variant={viewMode === 'continuous' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('continuous')}
            className="h-7 px-2 text-xs"
            title="Continuous scroll"
          >
            <Type className="h-3 w-3" />
          </Button>
          
          <Button
            variant={viewMode === 'two-page' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('two-page')}
            className="h-7 px-2 text-xs"
            title="Two pages"
          >
            <Columns className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Right: Document Info & Actions */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {contentData.type?.toUpperCase()}
        </Badge>
        
        <Separator orientation="vertical" className="h-5" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (contentData.text) {
              navigator.clipboard.writeText(contentData.text);
            }
          }}
          disabled={!contentData.text}
          className="h-7 px-2 text-xs"
          title="Copy text"
        >
          <Copy className="h-3 w-3" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            }
          }}
          className="h-7 px-2 text-xs"
          title="Fullscreen"
        >
          <Maximize2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}