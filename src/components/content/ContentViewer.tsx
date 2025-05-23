
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Link, FileText, Play } from 'lucide-react';
import { ContentData } from '@/pages/ContentPage';

interface ContentViewerProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
}

export function ContentViewer({ contentData, onUpdateContent }: ContentViewerProps) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlSubmit = () => {
    if (!url.trim()) return;
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
      onUpdateContent({
        type: isYouTube ? 'youtube' : 'video',
        url: url.trim(),
        title: `${isYouTube ? 'YouTube' : 'Video'} Content`
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleTextSubmit = () => {
    if (!text.trim()) return;
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      onUpdateContent({
        type: 'pdf', // We'll treat text as PDF-like content
        metadata: { text: text.trim() },
        title: 'Text Content'
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    // Simulate file processing
    setTimeout(() => {
      const isPDF = file.type === 'application/pdf';
      const isVideo = file.type.startsWith('video/');
      
      onUpdateContent({
        type: isPDF ? 'pdf' : isVideo ? 'video' : 'pdf',
        filePath: URL.createObjectURL(file),
        title: file.name
      });
      setIsLoading(false);
    }, 1000);
  };

  if (contentData.url || contentData.filePath || contentData.metadata?.text) {
    return (
      <div className="space-y-4">
        {/* Content Preview */}
        <div className="bg-[#1A1A1A] rounded-lg p-4 min-h-[200px] flex items-center justify-center">
          {contentData.type === 'youtube' && contentData.url && (
            <div className="text-center">
              <Play className="h-12 w-12 mx-auto mb-2 text-white/50" />
              <p className="text-white/70 text-sm">YouTube Video</p>
              <p className="text-white/50 text-xs mt-1 break-all">{contentData.url}</p>
            </div>
          )}
          
          {contentData.type === 'video' && (contentData.url || contentData.filePath) && (
            <div className="text-center">
              <Play className="h-12 w-12 mx-auto mb-2 text-white/50" />
              <p className="text-white/70 text-sm">Video Content</p>
              <p className="text-white/50 text-xs mt-1 break-all">
                {contentData.url || contentData.filePath}
              </p>
            </div>
          )}
          
          {contentData.type === 'pdf' && (
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-2 text-white/50" />
              <p className="text-white/70 text-sm">
                {contentData.filePath ? 'PDF Document' : 'Text Content'}
              </p>
              {contentData.filePath && (
                <p className="text-white/50 text-xs mt-1 break-all">{contentData.filePath}</p>
              )}
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          className="w-full border-white/10 text-white/70 hover:bg-white/5"
          onClick={() => onUpdateContent({ url: undefined, filePath: undefined, metadata: undefined })}
        >
          Change Content
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div className="space-y-2">
        <label className="flex flex-col items-center justify-center w-full h-32 border border-white/10 rounded-lg cursor-pointer hover:border-white/20 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="h-6 w-6 text-white mb-2" />
            <p className="text-sm text-white">Upload File</p>
            <p className="text-xs text-white/60">PDF, Video, Audio</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.mp4,.avi,.mov,.mp3,.wav"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </label>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Link className="h-4 w-4 text-white/70" />
          <span className="text-sm text-white">Paste URL</span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="YouTube, Website URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-transparent border-white/10 text-white placeholder:text-white/50"
            disabled={isLoading}
          />
          <Button
            onClick={handleUrlSubmit}
            disabled={!url.trim() || isLoading}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Add
          </Button>
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-white/70" />
          <span className="text-sm text-white">Paste Text</span>
        </div>
        <Textarea
          placeholder="Paste your text content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-transparent border-white/10 text-white placeholder:text-white/50 min-h-[80px]"
          disabled={isLoading}
        />
        <Button
          onClick={handleTextSubmit}
          disabled={!text.trim() || isLoading}
          className="w-full bg-white/10 hover:bg-white/20 text-white"
        >
          {isLoading ? 'Processing...' : 'Add Text'}
        </Button>
      </div>
    </div>
  );
}
