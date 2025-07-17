import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
export function TutorialModal({
  open,
  onOpenChange
}: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  const totalSteps = 9;

  // Mark tutorial as seen when it's opened
  useEffect(() => {
    if (open) {
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  }, [open]);
  const tutorialSteps = [{
    title: "Upload, paste, or record",
    subtitle: "Upload, paste, or record content to start learning. Just add content in one quick click!",
    content: {
      type: 'video',
      src: '/videos/upload-demo.mp4',
      alt: 'Content Upload Demo'
    } as ContentType
  }, {
    title: "Website links",
    subtitle: "You can now paste website URLs to quickly understand the content.",
    content: {
      type: 'video',
      src: '/videos/website-links-demo.mp4',
      alt: 'Website Links Demo'
    } as ContentType
  }, {
    title: "Chat with AI",
    subtitle: "Ask questions and get personalized insights about your content. P.S. Use 'Think Mode' in the AI Chat.",
    content: {
      type: 'video',
      src: '/videos/ai-chat-demo.mp4',
      alt: 'AI Chat Demo'
    } as ContentType
  }, {
    title: "Practice flashcards",
    subtitle: "Learn with an AI tutor that simplifies ideas and guides you to the right sources. P.S. Say 'Teach Me' for the AI.",
    content: {
      type: 'video',
      src: '/videos/flashcards-demo.mp4',
      alt: 'Flashcards Demo'
    } as ContentType
  }, {
    title: "Generate summaries, chapters, and transcripts",
    subtitle: "Get brief summaries, chapter breakdowns, and transcripts of your content.",
    content: {
      type: 'video',
      src: '/videos/summaries-demo.mp4',
      alt: 'Summaries Demo'
    } as ContentType
  }, {
    title: "Summary prompts",
    subtitle: "Get the exact information you need by creating custom prompts for your summaries.",
    content: {
      type: 'video',
      src: '/videos/prompts-demo.mp4',
      alt: 'Summary Prompts Demo'
    } as ContentType
  }, {
    title: "Study with exams",
    subtitle: "Study your topic with exams that break down into concepts, a chat to ask questions, feedback, and sources.",
    content: {
      type: 'video',
      src: '/videos/quizzes-demo.mp4',
      alt: 'Quizzes Demo'
    } as ContentType
  }, {
    title: "Rooms & room chat",
    subtitle: "Add contents to your rooms, chat with all your contents, and more!",
    content: {
      type: 'video',
      src: '/videos/spaces-demo.mp4',
      alt: 'Spaces Demo'
    } as ContentType
  }, {
    title: "Languages, AI Models, & More",
    subtitle: "Choose from 10+ languages and 3+ AI models in account settings.",
    content: {
      type: 'video',
      src: '/videos/settings-demo.mp4',
      alt: 'Settings Demo'
    } as ContentType
  }];
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
      return <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src={content.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>;
    }
    return <img src={content.src} alt={content.alt || ''} className="w-full h-full object-cover" />;
  };
  return <Dialog open={open} onOpenChange={isOpen => {
    if (!isOpen) {
      setCurrentStep(0);
      setActiveTab('upload');
    }
    onOpenChange(isOpen);
  }}>
      <DialogContent className="!max-w-3xl w-[95vw] gap-0 p-0 bg-card border border-border">
        {/* Close button - X in the top right */}
        <button onClick={() => onOpenChange(false)} className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        <DialogHeader className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
            {tutorialSteps[currentStep].title}
          </DialogTitle>
          <p className="text-base text-muted-foreground/80 mt-1.5">
            {tutorialSteps[currentStep].subtitle}
          </p>
        </DialogHeader>

        {/* Main content area */}
        <div className="px-6">
          {currentStep === 0 ? <div className="space-y-6 py-4">
              <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 gap-2 p-1 h-14 bg-background">
                  <TabsTrigger value="upload" className="h-full rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="paste" className="h-full rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
                    Paste
                  </TabsTrigger>
                  <TabsTrigger value="record" className="h-full rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
                    Record
                  </TabsTrigger>
                </TabsList>
                <div className="relative w-full aspect-video bg-card rounded-lg overflow-hidden border border-border/50 mt-6">
                  {renderContent(tutorialSteps[currentStep].content)}
                </div>
              </Tabs>
            </div> : <div className="pt-4 pb-6">
              <div className="relative w-full aspect-video bg-card rounded-lg overflow-hidden border border-border/50">
                {renderContent(tutorialSteps[currentStep].content)}
              </div>
            </div>}
        </div>

        {/* Footer with navigation controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
          {/* Step dots */}
          <div className="flex gap-1">
            {Array.from({
            length: totalSteps
          }).map((_, index) => <div key={index} className={cn("h-2 w-2 rounded-full transition-colors", index === currentStep ? "bg-primary shadow-sm shadow-primary/50" : "bg-primary/20 hover:bg-primary/30 transition-colors")} />)}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && <Button variant="ghost" onClick={handleBack} className="hover:bg-accent">
                Back
              </Button>}
            <Button onClick={currentStep === totalSteps - 1 ? () => onOpenChange(false) : handleNext} className="bg-primary hover:bg-primary/90">
              {currentStep === totalSteps - 1 ? 'Close' : 'Next'}
              {currentStep !== totalSteps - 1 && <ArrowRight className="ml-2 h-4 w-4 opacity-70" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}