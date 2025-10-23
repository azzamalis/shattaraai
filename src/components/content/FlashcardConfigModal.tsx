import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FlashcardConfig {
  numberOfCards: number;
  difficulty: 'easy' | 'medium' | 'hard';
  includeHints: boolean;
  includeExplanations: boolean;
  focusOnKeyConcepts: boolean;
}

interface FlashcardConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: FlashcardConfig;
  onSave: (config: FlashcardConfig) => void;
}

export function FlashcardConfigModal({ open, onOpenChange, config, onSave }: FlashcardConfigModalProps) {
  const [localConfig, setLocalConfig] = useState<FlashcardConfig>(config);

  const handleSave = () => {
    onSave(localConfig);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Flashcard Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Number of Cards: {localConfig.numberOfCards}</Label>
            <Slider
              value={[localConfig.numberOfCards]}
              onValueChange={([value]) => setLocalConfig({ ...localConfig, numberOfCards: value })}
              min={5}
              max={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Generate between 5 and 50 flashcards
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Hints</Label>
                <p className="text-xs text-muted-foreground">
                  Add helpful hints to each flashcard
                </p>
              </div>
              <Switch
                checked={localConfig.includeHints}
                onCheckedChange={(checked) => setLocalConfig({ ...localConfig, includeHints: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Explanations</Label>
                <p className="text-xs text-muted-foreground">
                  Add detailed explanations for answers
                </p>
              </div>
              <Switch
                checked={localConfig.includeExplanations}
                onCheckedChange={(checked) => setLocalConfig({ ...localConfig, includeExplanations: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Focus on Key Concepts</Label>
                <p className="text-xs text-muted-foreground">
                  Prioritize the most important topics
                </p>
              </div>
              <Switch
                checked={localConfig.focusOnKeyConcepts}
                onCheckedChange={(checked) => setLocalConfig({ ...localConfig, focusOnKeyConcepts: checked })}
              />
            </div>
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
