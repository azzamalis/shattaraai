
import React from 'react';
import { ChatTabType } from '@/lib/types';
import { FileStack, Brain } from 'lucide-react';

interface EmptyStatesProps {
  type: ChatTabType;
}

export function EmptyStates({ type }: EmptyStatesProps) {
  const getContent = () => {
    switch (type) {
      case 'flashcards':
        return {
          icon: FileStack,
          title: 'Flashcards',
          description: 'Learn with the Shattara AI Tutor using interactive flashcards.'
        };
      case 'quizzes':
        return {
          icon: Brain,
          title: 'Quizzes',
          description: 'Learn with the Shattara AI Tutor through adaptive quizzes.'
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  const Icon = content.icon;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {content.title}
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        {content.description}
      </p>
    </div>
  );
}
