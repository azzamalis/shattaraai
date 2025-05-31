
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ClipboardPaste, ArrowLeft, ArrowRight, Check, FileText, Video, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

interface ExamPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'audio' | 'text';
  isSelected: boolean;
}

export function ExamPrepModal({ isOpen, onClose }: ExamPrepModalProps) {
  const [step, setStep] = useState(1);
  const [numQuestions, setNumQuestions] = useState('25');
  const [examLength, setExamLength] = useState('60');
  const [questionType, setQuestionType] = useState('Both');
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'The British Empire',
      type: 'video',
      isSelected: false
    },
    {
      id: '2',
      title: 'Think Fast, Talk Smart',
      type: 'video',
      isSelected: false
    },
    {
      id: '3',
      title: 'Understanding Applied Psychology',
      type: 'document',
      isSelected: false
    },
    {
      id: '4',
      title: 'Social Class',
      type: 'text',
      isSelected: false
    }
  ]);
  
  const totalSteps = 3;
  const selectedCount = contentItems.filter(item => item.isSelected).length;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save exam configuration to localStorage
      const examConfig = {
        selectedTopics: contentItems.filter(item => item.isSelected).map(item => item.title),
        numQuestions,
        questionType,
        examLength
      };
      localStorage.setItem('examConfig', JSON.stringify(examConfig));
      
      // Close modal and navigate to loading page
      onClose();
      navigate('/exam-loading');
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

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-muted-foreground" />;
      case 'document':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'audio':
        return <Headphones className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleStartExam = () => {
    // Save exam configuration to localStorage
    const examConfig = {
      selectedTopics: contentItems.filter(item => item.isSelected).map(item => item.title),
      numQuestions,
      questionType,
      examLength
    };
    localStorage.setItem('examConfig', JSON.stringify(examConfig));
    
    // Close the modal
    onClose();
    
    // Navigate to loading screen
    navigate('/exam-loading');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-4xl p-0 rounded-lg",
        "bg-card border-border"
      )}>
        <div className="p-6">
          {/* Progress bar */}
          <div className="flex justify-center mb-8">
            <div className="w-1/3 flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                  key={index}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    index + 1 <= step 
                      ? "bg-primary"
                      : "bg-border"
                  )}
                />
              ))}
            </div>
          </div>
          
          {/* Step 1: Choose contents */}
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose contents to have for your exam below</h2>
              <p className="text-muted-foreground mb-8">An exam will be generated based on these contents</p>
              
              <div className="max-w-2xl mx-auto mb-8">
                <div className="space-y-3">
                  {contentItems.map(item => (
                    <div 
                      key={item.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg",
                        "border border-border",
                        "hover:border-muted-foreground/50",
                        "transition-colors cursor-pointer"
                      )}
                      onClick={() => toggleItemSelection(item.id)}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200",
                        item.isSelected 
                          ? "bg-primary border-primary" 
                          : "border-muted-foreground"
                      )}>
                        {item.isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      
                      <div className="flex items-center gap-3 flex-1 text-left">
                        {getContentIcon(item.type)}
                        <span className="font-medium text-foreground">{item.title}</span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground capitalize">
                        {item.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200",
                      selectedCount === contentItems.length ? "bg-primary border-primary" : "border-muted-foreground"
                    )}>
                      {selectedCount === contentItems.length && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span>Select All ({selectedCount}/{contentItems.length})</span>
                  </button>
                </div>
                <Button 
                  onClick={handleNext}
                  disabled={selectedCount === 0}
                  className={cn(
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90 transition-colors px-4",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 2: Have a practice exam */}
          {step === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Have a practice exam or cheatsheet for reference?</h2>
              <p className="text-muted-foreground mb-8">We will use this to make the exam as accurate as possible</p>
              
              <div className="flex justify-center gap-6 mt-10 mb-20">
                <div className="w-80 h-36 border border-border rounded-lg p-4 flex flex-col items-center justify-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-foreground mb-2" />
                  <span className="font-medium text-foreground">Upload</span>
                  <span className="text-muted-foreground text-sm">File, Audio, Video</span>
                </div>
                
                <div className="w-80 h-36 border border-border rounded-lg p-4 flex flex-col items-center justify-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <ClipboardPaste className="h-6 w-6 text-foreground mb-2" />
                  <span className="font-medium text-foreground">Paste</span>
                  <span className="text-muted-foreground text-sm">YouTube, Website, Text</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleBack}
                  variant="ghost" 
                  className="text-foreground hover:bg-accent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSkip}
                    variant="ghost" 
                    className="text-foreground hover:bg-accent"
                  >
                    Skip
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4"
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
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose your preference</h2>
              
              <div className="grid grid-cols-2 gap-8 mt-8 mb-8 max-w-2xl mx-auto">
                <div>
                  <Label htmlFor="numQuestions" className="text-foreground flex items-center">
                    Number of Questions <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="numQuestions" 
                    value={numQuestions} 
                    onChange={(e) => setNumQuestions(e.target.value)} 
                    className="bg-background border-border text-foreground mt-2 h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="questionType" className="text-foreground flex items-center">
                    Question Type <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger className="bg-background border-border text-foreground mt-2 h-12">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Both" className="text-foreground hover:bg-accent focus:bg-accent">Both</SelectItem>
                      <SelectItem value="Multiple Choice" className="text-foreground hover:bg-accent focus:bg-accent">Multiple Choice</SelectItem>
                      <SelectItem value="Free Writing" className="text-foreground hover:bg-accent focus:bg-accent">Free Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="examLength" className="text-foreground">
                    Exam Length (Minutes)
                  </Label>
                  <Input 
                    id="examLength" 
                    value={examLength} 
                    onChange={(e) => setExamLength(e.target.value)} 
                    placeholder="e.g. 60" 
                    className="bg-background border-border text-foreground mt-2 h-12"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleBack}
                  variant="ghost" 
                  className="text-foreground hover:bg-accent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSkip}
                    variant="ghost" 
                    className="text-foreground hover:bg-accent"
                  >
                    Skip
                  </Button>
                  <Button 
                    onClick={handleStartExam}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4"
                  >
                    Start Exam
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
