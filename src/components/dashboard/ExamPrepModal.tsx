
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Paste, SkipForward, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface ExamPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamPrepModal({ isOpen, onClose }: ExamPrepModalProps) {
  const [step, setStep] = useState(1);
  const [numQuestions, setNumQuestions] = useState('25');
  const [examLength, setExamLength] = useState('60');
  const [questionType, setQuestionType] = useState('Both');
  
  const totalSteps = 3;
  
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-black border border-white/10 p-0 rounded-lg">
        <div className="p-8 w-full">
          {/* Progress bar */}
          <div className="flex justify-center mb-8">
            <div className="w-1/3 flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <Progress 
                  key={index} 
                  value={index + 1 <= step ? 100 : 0} 
                  className="h-1"
                  indicatorClassName={index + 1 === step ? "bg-[#00A3FF]" : index + 1 < step ? "bg-[#0E8345]" : ""}
                />
              ))}
            </div>
          </div>
          
          {/* Step 1: Choose contents */}
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Choose contents to have for your exam below</h2>
              <p className="text-[#A6A6A6] mb-8">An exam will be generated based on these contents</p>
              
              <div className="flex justify-between items-center mt-32 mb-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="selectAll" className="rounded border-white/20 bg-transparent" />
                  <Label htmlFor="selectAll" className="text-white">Select All (1/1)</Label>
                </div>
                <Button 
                  onClick={handleNext}
                  className="bg-white text-black hover:bg-white/90 transition-colors px-4"
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
              
              <div className="flex justify-center gap-4 mt-10 mb-20">
                <div className="w-72 h-32 border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:border-white/20 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-white mb-2" />
                  <span className="text-white font-medium">Upload</span>
                  <span className="text-[#A6A6A6] text-sm">File, Audio, Video</span>
                </div>
                
                <div className="w-72 h-32 border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center hover:border-white/20 transition-colors cursor-pointer">
                  <Paste className="h-6 w-6 text-white mb-2" />
                  <span className="text-white font-medium">Paste</span>
                  <span className="text-[#A6A6A6] text-sm">YouTube, Website, Text</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-10">
                <Button 
                  onClick={handleBack}
                  variant="ghost" 
                  className="text-white hover:bg-white/5"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSkip}
                    variant="ghost" 
                    className="text-white hover:bg-white/5"
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
              
              <div className="grid grid-cols-2 gap-8 mt-8 mb-8 max-w-lg mx-auto">
                <div>
                  <Label htmlFor="numQuestions" className="text-white flex items-center">
                    Number of Questions <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="numQuestions" 
                    value={numQuestions} 
                    onChange={(e) => setNumQuestions(e.target.value)} 
                    className="bg-transparent border-white/10 text-[#A6A6A6] mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="questionType" className="text-white flex items-center">
                    Question Type <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative mt-2">
                    <select 
                      id="questionType" 
                      value={questionType} 
                      onChange={(e) => setQuestionType(e.target.value)} 
                      className="w-full bg-transparent border border-white/10 text-[#A6A6A6] rounded-md px-3 py-2 appearance-none"
                    >
                      <option value="Both">Both</option>
                      <option value="Multiple Choice">Multiple Choice</option>
                      <option value="Written">Written</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
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
                    className="bg-transparent border-white/10 text-[#A6A6A6] mt-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8">
                <Button 
                  onClick={handleBack}
                  variant="ghost" 
                  className="text-white hover:bg-white/5"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSkip}
                    variant="ghost" 
                    className="text-white hover:bg-white/5"
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
