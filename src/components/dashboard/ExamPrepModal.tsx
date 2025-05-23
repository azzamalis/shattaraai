import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ClipboardPaste, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'audio' | 'text';
  thumbnail: string;
  isSelected: boolean;
}

export function ExamPrepModal({ isOpen, onClose }: ExamPrepModalProps) {
  const [step, setStep] = useState(1);
  const [numQuestions, setNumQuestions] = useState('25');
  const [examLength, setExamLength] = useState('60');
  const [questionType, setQuestionType] = useState('Both');
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'The British Empire',
      type: 'video',
      thumbnail: '/thumbnails/british-empire.jpg',
      isSelected: false
    },
    {
      id: '2',
      title: 'Think Fast, Talk Smart',
      type: 'video',
      thumbnail: '/thumbnails/think-fast.jpg',
      isSelected: false
    },
    {
      id: '3',
      title: 'Understanding Applied Psychology',
      type: 'document',
      thumbnail: '/thumbnails/psychology.jpg',
      isSelected: false
    },
    {
      id: '4',
      title: 'Social Class',
      type: 'text',
      thumbnail: '/thumbnails/social-class.jpg',
      isSelected: false
    }
  ]);
  
  const totalSteps = 3;
  const selectedCount = contentItems.filter(item => item.isSelected).length;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Handle exam creation here
      onClose();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const toggleSelectAll = () => {
    const allSelected = contentItems.every(item => item.isSelected);
    setContentItems(contentItems.map(item => ({
      ...item,
      isSelected: !allSelected
    })));
  };

  const toggleItemSelection = (id: string) => {
    setContentItems(contentItems.map(item => 
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-black border border-white/10 p-0 rounded-lg">
        <div className="p-6">
          {/* Progress bar */}
          <div className="flex justify-center mb-8">
            <div className="w-1/3 flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                  key={index}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    index + 1 <= step ? "bg-[#00a3ff]" : "bg-white/10"
                  )}
                />
              ))}
            </div>
          </div>
          
          {/* Step 1: Choose contents */}
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Choose contents to have for your exam below</h2>
              <p className="text-[#A6A6A6] mb-8">An exam will be generated based on these contents</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {contentItems.map(item => (
                  <div 
                    key={item.id}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 transition-opacity duration-200 group-hover:opacity-70" />
                    <div className="absolute top-2 right-2">
                      <div className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors duration-200",
                        item.isSelected ? "bg-[#00a3ff] border-[#00a3ff]" : "border-white/50 bg-black/50"
                      )}>
                        {item.isSelected && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-white hover:text-white/90 transition-colors"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200",
                      selectedCount === contentItems.length ? "bg-[#00a3ff] border-[#00a3ff]" : "border-white/50"
                    )}>
                      {selectedCount === contentItems.length && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span>Select All ({selectedCount}/{contentItems.length})</span>
                  </button>
                </div>
                <Button 
                  onClick={handleNext}
                  disabled={selectedCount === 0}
                  className="bg-white text-black hover:bg-white/90 transition-colors px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 2: Have a practice exam */}
          {step === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Have a practice exam or cheatsheet for reference?</h2>
              <p className="text-[#A6A6A6] mb-8">We will use this to make the exam as accurate as possible</p>
              
              <div className="flex justify-center gap-6 mt-10 mb-20">
                <div className="w-80 h-36 border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:border-white/20 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-white mb-2" />
                  <span className="text-white font-medium">Upload</span>
                  <span className="text-[#A6A6A6] text-sm">File, Audio, Video</span>
                </div>
                
                <div className="w-80 h-36 border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:border-white/20 transition-colors cursor-pointer">
                  <ClipboardPaste className="h-6 w-6 text-white mb-2" />
                  <span className="text-white font-medium">Paste</span>
                  <span className="text-[#A6A6A6] text-sm">YouTube, Website, Text</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleBack}
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSkip}
                    variant="ghost" 
                    className="text-white hover:bg-white/10 hover:text-white"
                  >
                    Skip
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="bg-white text-black hover:bg-white/90 transition-colors px-4"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Choose your preference */}
          {step === 3 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Choose your preference</h2>
              
              <div className="grid grid-cols-2 gap-8 mt-8 mb-8 max-w-2xl mx-auto">
                <div>
                  <Label htmlFor="numQuestions" className="text-white flex items-center">
                    Number of Questions <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="numQuestions" 
                    value={numQuestions} 
                    onChange={(e) => setNumQuestions(e.target.value)} 
                    className="bg-transparent border-white/10 text-white mt-2 h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="questionType" className="text-white flex items-center">
                    Question Type <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger className="bg-transparent border-white/10 text-white mt-2 h-12">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-white/10">
                      <SelectItem value="Both" className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">Both</SelectItem>
                      <SelectItem value="Multiple Choice" className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">Multiple Choice</SelectItem>
                      <SelectItem value="Written" className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white">Written</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="examLength" className="text-white">
                    Exam Length (Minutes)
                  </Label>
                  <Input 
                    id="examLength" 
                    value={examLength} 
                    onChange={(e) => setExamLength(e.target.value)} 
                    placeholder="e.g. 60" 
                    className="bg-transparent border-white/10 text-white mt-2 h-12"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleBack}
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSkip}
                    variant="ghost" 
                    className="text-white hover:bg-white/10 hover:text-white"
                  >
                    Skip
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="bg-white text-black hover:bg-white/90 transition-colors px-4"
                  >
                    Start <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
