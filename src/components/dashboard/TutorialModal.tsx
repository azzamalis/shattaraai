
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TutorialModal({ open, onOpenChange }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;

  // Mark tutorial as seen when it's opened
  useEffect(() => {
    if (open) {
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  }, [open]);

  const tutorialSteps = [
    {
      title: "Welcome to Shattara",
      subtitle: "Let's get you started with a quick tour",
      content: (
        <div className="flex flex-col items-center text-center p-6">
          <img src="/placeholder.svg" alt="Welcome" className="w-64 h-64 mb-4" />
          <p className="text-lg mb-4">
            Shattara is your all-in-one AI-powered study platform designed to help you learn more efficiently.
          </p>
          <p className="text-md">
            This quick guide will walk you through the main features to help you get started right away.
          </p>
        </div>
      )
    },
    {
      title: "Create Your Study Rooms",
      subtitle: "Organize your materials in one place",
      content: (
        <div className="flex flex-col md:flex-row items-center p-6 gap-8">
          <img src="/placeholder.svg" alt="Study Rooms" className="w-48 h-48" />
          <div>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create dedicated rooms for different subjects or courses</li>
              <li>Each room organizes all your notes and materials in one place</li>
              <li>Invite collaborators to share and work together</li>
              <li>Access your content from any device, anywhere</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Add Your Content",
      subtitle: "Upload notes, paste text, or record voice",
      content: (
        <div className="flex flex-col md:flex-row items-center p-6 gap-8">
          <div>
            <ul className="list-disc pl-5 space-y-2">
              <li>Upload PDFs, images, and documents with one click</li>
              <li>Paste text directly from websites or other sources</li>
              <li>Record your voice for audio notes</li>
              <li>Our AI automatically organizes and indexes everything</li>
            </ul>
          </div>
          <img src="/placeholder.svg" alt="Content Upload" className="w-48 h-48" />
        </div>
      )
    },
    {
      title: "Learn with AI",
      subtitle: "Ask questions and get instant answers",
      content: (
        <div className="flex flex-col md:flex-row items-center p-6 gap-8">
          <img src="/placeholder.svg" alt="AI Learn" className="w-48 h-48" />
          <div>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ask any question about your content</li>
              <li>Generate practice quizzes to test your knowledge</li>
              <li>Create flashcards with a single click</li>
              <li>Get explanations tailored to your learning style</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      subtitle: "Start learning smarter today",
      content: (
        <div className="flex flex-col items-center text-center p-6">
          <img src="/placeholder.svg" alt="Getting Started" className="w-64 h-64 mb-4" />
          <p className="text-lg mb-4">
            You're now ready to use Shattara to revolutionize your learning experience.
          </p>
          <p className="text-md mb-6">
            Start by creating your first room and adding some content.
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => onOpenChange(false)}
          >
            Get Started
          </Button>
        </div>
      )
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

  const handleClose = () => {
    setCurrentStep(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setCurrentStep(0);
      }
      onOpenChange(isOpen);
    }}>
      <DialogOverlay className="bg-black/70 backdrop-blur-sm" />
      <DialogContent className="max-w-3xl w-[95vw] h-[90vh] md:h-auto p-0 bg-white rounded-xl border-0 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close tutorial"
        >
          <X className="h-4 w-4 text-gray-700" />
        </button>

        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">{tutorialSteps[currentStep].title}</h2>
          <p className="text-sm text-gray-500 mt-1">{tutorialSteps[currentStep].subtitle}</p>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto bg-gray-50 min-h-[300px] max-h-[60vh]">
          {tutorialSteps[currentStep].content}
        </div>

        {/* Footer with navigation controls */}
        <div className="p-4 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between">
          {/* Step dots */}
          <div className="flex space-x-2 justify-center mb-4 sm:mb-0">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-4 py-2"
              >
                Back
              </Button>
            )}
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2"
              onClick={handleNext}
            >
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
