
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatTabType } from '@/lib/types';
import { FileStack, Brain, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStatesProps {
  type: ChatTabType;
  contentId?: string;
}

export function EmptyStates({ type, contentId }: EmptyStatesProps) {
  const navigate = useNavigate();

  const handleBackToChat = () => {
    if (contentId) {
      navigate(`/chat/${contentId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const getContent = () => {
    switch (type) {
      case 'flashcards':
        return {
          icon: FileStack,
          title: 'Interactive Flashcards',
          description: 'Transform your chat conversations into interactive flashcards for better retention and review.',
          features: [
            'Auto-generate flashcards from chat content',
            'Spaced repetition learning',
            'Progress tracking',
            'Custom difficulty levels'
          ],
          actionText: 'Generate Flashcards'
        };
      case 'quizzes':
        return {
          icon: Brain,
          title: 'Adaptive Quizzes',
          description: 'Test your understanding with AI-powered quizzes based on your chat discussions.',
          features: [
            'Multiple choice and free response',
            'Adaptive difficulty adjustment',
            'Instant feedback and explanations',
            'Performance analytics'
          ],
          actionText: 'Create Quiz'
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  const Icon = content.icon;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToChat}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chat
        </Button>
      </div>

      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        <Icon className="h-10 w-10 text-primary" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-foreground">
          {content.title}
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          {content.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
        {content.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Button className="mt-6 px-6">
        <Icon className="h-4 w-4 mr-2" />
        {content.actionText}
      </Button>

      <p className="text-xs text-muted-foreground/60 text-center max-w-sm">
        Start chatting to generate personalized {type} based on your conversations
      </p>
    </div>
  );
}
