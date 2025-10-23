import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';

interface QuizConfig {
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  includeExplanations: boolean;
  questionTypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
  };
}

interface QuizConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: QuizConfig;
  onSave: (config: QuizConfig) => void;
}

export function QuizConfigModal({ open, onOpenChange, config, onSave }: QuizConfigModalProps) {
  const [localConfig, setLocalConfig] = useState<QuizConfig>(config);

  const handleSave = () => {
    onSave(localConfig);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quiz Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Number of Questions: {localConfig.numberOfQuestions}</Label>
            <Slider
              value={[localConfig.numberOfQuestions]}
              onValueChange={([value]) => setLocalConfig({ ...localConfig, numberOfQuestions: value })}
              min={5}
              max={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Generate between 5 and 50 questions
            </p>
          </div>

          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <ToggleGroup
              type="single"
              value={localConfig.difficulty}
              onValueChange={(value) => value && setLocalConfig({ ...localConfig, difficulty: value as any })}
              className="justify-start"
            >
              <ToggleGroupItem value="easy" className="px-4">
                Easy
              </ToggleGroupItem>
              <ToggleGroupItem value="medium" className="px-4">
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem value="hard" className="px-4">
                Hard
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-3">
            <Label>Question Types</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="multipleChoice"
                  checked={localConfig.questionTypes.multipleChoice}
                  onCheckedChange={(checked) =>
                    setLocalConfig({
                      ...localConfig,
                      questionTypes: { ...localConfig.questionTypes, multipleChoice: checked as boolean }
                    })
                  }
                />
                <label htmlFor="multipleChoice" className="text-sm font-medium">
                  Multiple Choice
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trueFalse"
                  checked={localConfig.questionTypes.trueFalse}
                  onCheckedChange={(checked) =>
                    setLocalConfig({
                      ...localConfig,
                      questionTypes: { ...localConfig.questionTypes, trueFalse: checked as boolean }
                    })
                  }
                />
                <label htmlFor="trueFalse" className="text-sm font-medium">
                  True/False
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shortAnswer"
                  checked={localConfig.questionTypes.shortAnswer}
                  onCheckedChange={(checked) =>
                    setLocalConfig({
                      ...localConfig,
                      questionTypes: { ...localConfig.questionTypes, shortAnswer: checked as boolean }
                    })
                  }
                />
                <label htmlFor="shortAnswer" className="text-sm font-medium">
                  Short Answer
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Explanations</Label>
              <p className="text-xs text-muted-foreground">
                Add detailed explanations for each answer
              </p>
            </div>
            <Switch
              checked={localConfig.includeExplanations}
              onCheckedChange={(checked) => setLocalConfig({ ...localConfig, includeExplanations: checked })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
