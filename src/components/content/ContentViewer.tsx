
import React from 'react';
import { ContentData } from '@/pages/ContentPage';
import { FileText, Video, Youtube, Globe } from 'lucide-react';

interface ContentViewerProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
}

export function ContentViewer({ contentData, onUpdateContent }: ContentViewerProps) {
  const renderViewer = () => {
    switch (contentData.type) {
      case 'pdf':
        return (
          <div className="w-full h-32 bg-[#18181b] rounded-xl border border-white/10 flex items-center justify-center">
            <div className="flex flex-col items-center text-white/60">
              <FileText className="h-8 w-8 mb-2" />
              <span className="text-sm">PDF Viewer</span>
              <span className="text-xs text-white/40">Coming Soon</span>
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="w-full h-32 bg-[#18181b] rounded-xl border border-white/10 flex items-center justify-center">
            <div className="flex flex-col items-center text-white/60">
              <Video className="h-8 w-8 mb-2" />
              <span className="text-sm">Video Player</span>
              <span className="text-xs text-white/40">Coming Soon</span>
            </div>
          </div>
        );
      
      case 'youtube':
        return (
          <div className="w-full h-32 bg-[#18181b] rounded-xl border border-white/10 flex items-center justify-center">
            <div className="flex flex-col items-center text-white/60">
              <Youtube className="h-8 w-8 mb-2" />
              <span className="text-sm">YouTube Player</span>
              <span className="text-xs text-white/40">Coming Soon</span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-32 bg-[#18181b] rounded-xl border border-white/10 flex items-center justify-center">
            <div className="flex flex-col items-center text-white/60">
              <Globe className="h-8 w-8 mb-2" />
              <span className="text-sm">Content Viewer</span>
              <span className="text-xs text-white/40">Loading...</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderViewer()}
    </div>
  );
}
