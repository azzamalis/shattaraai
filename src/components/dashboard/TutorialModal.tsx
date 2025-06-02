import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ContentType = {
  type: 'image' | 'video';
  src: string;
  alt?: string;
};

export function TutorialModal({ open, onOpenChange }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  const totalSteps = 9;

  // Mark tutorial as seen when it's opened
  useEffect(() => {
    if (open) {
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  }, [open]);

  const tutorialSteps = [
    {
      title: "Upload, paste, or record",
      subtitle: "Upload, paste, or record content to start learning. Just add content in one quick click!",
      content: {
        type: 'video',
        src: '/videos/upload-demo.mp4',
        alt: 'Content Upload Demo'
      } as ContentType
    },
    {
      title: "Website links",
      subtitle: "You can now paste website URLs to quickly understand the content.",
      content: {
        type: 'video',
        src: '/videos/website-links-demo.mp4',
        alt: 'Website Links Demo'
      } as ContentType
    },
    {
      title: "Chat with AI",
      subtitle: "Ask questions and get personalized insights about your content. P.S. Use 'Think Mode' in the AI Chat.",
      content: {
        type: 'video',
        src: '/videos/ai-chat-demo.mp4',
        alt: 'AI Chat Demo'
      } as ContentType
    },
    {
      title: "Practice flashcards",
      subtitle: "Learn with an AI tutor that simplifies ideas and guides you to the right sources. P.S. Say 'Teach Me' for the AI.",
      content: {
        type: 'video',
        src: '/videos/flashcards-demo.mp4',
        alt: 'Flashcards Demo'
      } as ContentType
    },
    {
      title: "Generate summaries, chapters, and transcripts",
      subtitle: "Get brief summaries, chapter breakdowns, and transcripts of your content.",
      content: {
        type: 'video',
        src: '/videos/summaries-demo.mp4',
        alt: 'Summaries Demo'
      } as ContentType
    },
    {
      title: "Summary prompts",
      subtitle: "Get the exact information you need by creating custom prompts for your summaries.",
      content: {
        type: 'video',
        src: '/videos/prompts-demo.mp4',
        alt: 'Summary Prompts Demo'
      } as ContentType
    },
    {
      title: "Study with quizzes",
      subtitle: "Study your topic with quizzes that break down into concepts, a chat to ask questions, feedback, and sources.",
      content: {
        type: 'video',
        src: '/videos/quizzes-demo.mp4',
        alt: 'Quizzes Demo'
      } as ContentType
    },
    {
      title: "Spaces & space chat",
      subtitle: "Add contents to your spaces, chat with all your contents, and more!",
      content: {
        type: 'video',
        src: '/videos/spaces-demo.mp4',
        alt: 'Spaces Demo'
      } as ContentType
    },
    {
      title: "Languages, AI Models, & More",
      subtitle: "Choose from 20+ languages and 4+ AI models in account settings.",
      content: {
        type: 'video',
        src: '/videos/settings-demo.mp4',
        alt: 'Settings Demo'
      } as ContentType
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderContent = (content: ContentType) => {
    if (content.type === 'video') {
      return (
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={content.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <img 
        src={content.src} 
        alt={content.alt || ''} 
        className="w-full h-full object-cover" 
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] sm:w-[80vw] md:w-[70vw]">
        <DialogHeader>
          <DialogTitle>{tutorialSteps[currentStep].title}</DialogTitle>
          <DialogDescription>
            {tutorialSteps[currentStep].subtitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          {renderContent(tutorialSteps[currentStep].content)}
        </div>
        
        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === currentStep 
                    ? "bg-primary" 
                    : "bg-primary/20"
                )}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === totalSteps - 1 ? 'Close' : 'Next'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
