import React from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { GenerationProgress, GenerationType } from './GenerationProgress';
import { AnimatePresence } from 'framer-motion';
interface GenerationPromptProps {
  type: 'flashcards' | 'quizzes' | 'summary';
  onGenerate: () => void;
  onConfigure: () => void;
  contentData: any;
  isLoading: boolean;
  targetId?: string;
}
const contentConfig = {
  flashcards: {
    title: 'Create Flashcards',
    description: 'Create flashcards with preferred number of cards and types of topics.'
  },
  quizzes: {
    title: 'Generate Quiz',
    description: 'Create quizzes with preferred question types, difficulty, and more.'
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
  isLoading,
  targetId
}: GenerationPromptProps) {
  const config = contentConfig[type];
  return <div className="w-full">
      <AnimatePresence mode="wait">
        {isLoading ? <GenerationProgress key="progress" type={type as GenerationType} isActive={isLoading} /> : <div key="prompt" className="bg-transparent rounded-2xl border-2 border-border p-6 shadow-sm px-[16px] py-[16px]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg text-foreground mb-2 font-medium">
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
                
                <Button id={targetId} onClick={() => onGenerate()} disabled={isLoading} className="rounded-full w-24 h-10 bg-foreground text-background hover:bg-foreground/90">
                  Generate
                </Button>
              </div>
            </div>
          </div>}
      </AnimatePresence>
    </div>;
}