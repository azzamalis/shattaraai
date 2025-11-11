import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TopicsSelector } from './config/TopicsSelector';

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
  topics?: string[];
}

export function FlashcardConfigModal({ open, onOpenChange, config, onSave, topics = [] }: FlashcardConfigModalProps) {
  const [localConfig, setLocalConfig] = useState<FlashcardConfig>(config);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [focusInstructions, setFocusInstructions] = useState('');

  const availableTopics = topics.length > 0 ? topics : ['General Content'];

  const handleSave = () => {
    onSave(localConfig);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create Flashcard Set</DialogTitle>
          <DialogDescription>
            Select specific concepts and customize your flashcard set
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="numberOfCards">
              Number of flashcards<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="numberOfCards"
              type="number"
              min={5}
              max={50}
              value={localConfig.numberOfCards}
              onChange={(e) => setLocalConfig({ ...localConfig, numberOfCards: parseInt(e.target.value) || 5 })}
              placeholder="e.g., 10"
              className="p-6"
            />
          </div>

          <div className="space-y-2">
            <Label>Select topics</Label>
            <TopicsSelector
              topics={availableTopics}
              selectedTopics={selectedTopics}
              onTopicsChange={setSelectedTopics}
              placeholder="Optional: Select concepts to focus on"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="focusInstructions">What should the flashcard focus on?</Label>
            <Textarea
              id="focusInstructions"
              value={focusInstructions}
              onChange={(e) => setFocusInstructions(e.target.value)}
              placeholder="Focus on the parts that are about..."
              className="min-h-[45px] max-h-[80px] resize-none p-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Create Set
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
