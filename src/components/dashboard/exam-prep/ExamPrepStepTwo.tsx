import React, { useState, useRef } from 'react';
import { Upload, ClipboardPaste, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasteContentModal } from '../PasteContentModal';
import { toast } from 'sonner';

interface ExamPrepStepTwoProps {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'file' | 'url' | 'text';
  file?: File;
  url?: string;
  text?: string;
}

export function ExamPrepStepTwo({ onBack, onNext, onSkip }: ExamPrepStepTwoProps) {
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newItem: ContentItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: file.name,
        type: 'file',
        file
      };
      setContentItems(prev => [...prev, newItem]);
      toast.success(`File "${file.name}" added successfully`);
    }
  };

  const handlePasteSubmit = (data: { url?: string; text?: string }) => {
    if (data.url) {
      const newItem: ContentItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.url,
        type: 'url',
        url: data.url
      };
      setContentItems(prev => [...prev, newItem]);
      toast.success("URL content added successfully");
    } else if (data.text) {
      const newItem: ContentItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Text Content',
        type: 'text',
        text: data.text
      };
      setContentItems(prev => [...prev, newItem]);
      toast.success("Text content added successfully");
    }
    setIsPasteModalOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Have a practice exam or cheatsheet for reference?
      </h2>
      <p className="text-muted-foreground mb-8">
        We will use this to make the exam as accurate as possible
      </p>
      
      <input 
        ref={fileInputRef} 
        type="file" 
        accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,audio/*,video/*" 
        onChange={handleFileSelect} 
        style={{ display: 'none' }} 
      />
      
      <div className="flex justify-center gap-6 mt-10 mb-8">
        <div 
          className="w-80 h-36 border border-border rounded-lg p-4 flex flex-col items-center justify-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onClick={handleUploadClick}
        >
          <Upload className="h-6 w-6 text-foreground mb-2" />
          <span className="font-medium text-foreground">Upload</span>
          <span className="text-muted-foreground text-sm">File, Audio, Video</span>
        </div>
        
        <div 
          className="w-80 h-36 border border-border rounded-lg p-4 flex flex-col items-center justify-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onClick={() => setIsPasteModalOpen(true)}
        >
          <ClipboardPaste className="h-6 w-6 text-foreground mb-2" />
          <span className="font-medium text-foreground">Paste</span>
          <span className="text-muted-foreground text-sm">YouTube, Website, Text</span>
        </div>
      </div>

      {/* Content Items List */}
      {contentItems.length > 0 && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="space-y-2">
            {contentItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {item.type === 'file' && <Upload className="h-4 w-4 text-muted-foreground" />}
                  {item.type === 'url' && <ClipboardPaste className="h-4 w-4 text-muted-foreground" />}
                  {item.type === 'text' && <ClipboardPaste className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm text-foreground truncate">{item.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-foreground hover:bg-accent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            onClick={onSkip}
            variant="ghost" 
            className="text-foreground hover:bg-accent"
          >
            Skip
          </Button>
          <Button 
            onClick={onNext}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <PasteContentModal 
        isOpen={isPasteModalOpen} 
        onClose={() => setIsPasteModalOpen(false)} 
        onSubmit={handlePasteSubmit} 
      />
    </div>
  );
}
