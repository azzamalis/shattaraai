import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SquareCheckBig, FileText, ToggleLeft, Type } from 'lucide-react';
import { PillButton } from './config/PillButton';
import { StarDifficulty } from './config/StarDifficulty';
import { TopicsSelector } from './config/TopicsSelector';
import { toast } from 'sonner';

interface QuizConfig {
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  includeExplanations: boolean;
  questionTypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
    fillInBlank?: boolean;
  };
}

interface QuizConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: QuizConfig;
  onSave: (config: QuizConfig) => void;
  topics?: string[];
}

export function QuizConfigModal({ open, onOpenChange, config, onSave, topics = [] }: QuizConfigModalProps) {
  const [localConfig, setLocalConfig] = useState<QuizConfig>(config);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [focusInstructions, setFocusInstructions] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState<string>('');

  const availableTopics = topics.length > 0 ? topics : ['General Content'];

  // Reset fields when modal opens
  useEffect(() => {
    if (open) {
      setNumberOfQuestions('');
      setSelectedTopics([]);
      setFocusInstructions('');
    }
  }, [open]);

  const questionTypeOptions = [
    { key: 'multipleChoice' as const, icon: SquareCheckBig, label: 'Multiple Choice', colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    { key: 'shortAnswer' as const, icon: FileText, label: 'Free Response', colorClass: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
    { key: 'trueFalse' as const, icon: ToggleLeft, label: 'True or False', colorClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  ];

  const toggleQuestionType = (type: keyof QuizConfig['questionTypes']) => {
    setLocalConfig({
      ...localConfig,
      questionTypes: {
        ...localConfig.questionTypes,
        [type]: !localConfig.questionTypes[type],
      },
    });
  };

  const handleSave = () => {
    const questionsCount = parseInt(numberOfQuestions) || 10;
    
    // Validate that at least one question type is selected
    const hasSelectedType = Object.values(localConfig.questionTypes).some(value => value === true);
    if (!hasSelectedType) {
      toast.error('Please select at least one question type');
      return;
    }
    
    onSave({ ...localConfig, numberOfQuestions: questionsCount });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Customize Quiz</DialogTitle>
          <DialogDescription>
            Create quiz sets with preferred question types, difficulty, and more.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>
              Question Types <span className="text-red-500">*</span>
            </Label>
            <div className="p-1.5 rounded-2xl border border-primary/20 bg-card w-full">
              <div className="flex flex-wrap gap-1.5">
                {questionTypeOptions.map((option) => (
                  <PillButton
                    key={option.key}
                    icon={option.icon}
                    label={option.label}
                    selected={localConfig.questionTypes[option.key]}
                    onClick={() => toggleQuestionType(option.key)}
                    colorClass={option.colorClass}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Difficulty <span className="text-red-500">*</span>
            </Label>
            <StarDifficulty
              value={localConfig.difficulty}
              onChange={(difficulty) => setLocalConfig({ ...localConfig, difficulty })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions">Number of Questions</Label>
            <Input
              id="numberOfQuestions"
              type="number"
              max={30}
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
              placeholder="e.g., 10"
              className="p-6"
            />
          </div>

          <div className="space-y-2">
            <Label>Topics</Label>
            <TopicsSelector
              topics={availableTopics}
              selectedTopics={selectedTopics}
              onTopicsChange={setSelectedTopics}
              placeholder="Select topics for this set"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="focusInstructions">What should the quiz focus on?</Label>
            <Textarea
              id="focusInstructions"
              value={focusInstructions}
              onChange={(e) => setFocusInstructions(e.target.value)}
              placeholder="Focus on the parts that are about..."
              className="min-h-[80px] max-h-[80px] resize-none p-3"
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
