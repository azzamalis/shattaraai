import React from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
interface GenerationPromptProps {
  type: 'flashcards' | 'quizzes' | 'summary';
  onGenerate: () => void;
  onConfigure: () => void;
  contentData: any;
  isLoading: boolean;
}
const contentConfig = {
  flashcards: {
    title: 'Create Flashcards',
    description: 'Create a flashcard set with preferred number of cards, types of topics, and more.'
  },
  quizzes: {
    title: 'Generate Quiz',
    description: 'Generate a quiz with preferred difficulty, question types, and topic coverage.'
  },
  summary: {
    title: 'Generate Summary',
    description: 'Create an AI-powered summary with key points, main topics, and insights.'
  }
};
export function GenerationPrompt({
  type,
  onGenerate,
  onConfigure,
  contentData,
  isLoading
}: GenerationPromptProps) {
  const config = contentConfig[type];
  return <div className="w-full">
      <div className="bg-transparent rounded-2xl border-2 border-border p-6 shadow-sm px-[16px] py-[15px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {config.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onConfigure} disabled={isLoading} className="rounded-full w-10 h-9">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            
            <Button onClick={onGenerate} disabled={isLoading} className="rounded-full w-24 h-10 bg-foreground text-background hover:bg-foreground/90">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
            </Button>
          </div>
        </div>
      </div>
    </div>;
}