import React, { useMemo } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flashcard, FlashcardData, FilterOptions } from '@/components/content/Flashcard';
import { FlashcardManagement } from '@/components/content/FlashcardManagement';
import { useFlashcardState } from '@/hooks/useFlashcardState';
import { useFlashcardFilters } from '@/hooks/useFlashcardFilters';
import { useFlashcardManagement } from '@/hooks/useFlashcardManagement';
import { ChatMessage } from '@/hooks/useChatConversation';
import { Button } from '@/components/ui/button';
import { Plus, Brain } from 'lucide-react';

interface ChatFlashcardContainerProps {
  messages: ChatMessage[];
}

const generateFlashcardsFromChat = (messages: ChatMessage[]): FlashcardData[] => {
  if (messages.length === 0) {
    return [];
  }

  const flashcards: FlashcardData[] = [];
  
  // Generate flashcards from user questions and AI responses
  messages.forEach((message, index) => {
    if (message.sender_type === 'user' && message.content.includes('?')) {
      const userQuestion = message.content;
      const aiResponse = messages[index + 1];
      
      if (aiResponse && aiResponse.sender_type === 'ai') {
        // Create flashcard from Q&A pair
        flashcards.push({
          id: `chat-flashcard-${index}`,
          question: userQuestion.length > 100 ? userQuestion.slice(0, 100) + '...' : userQuestion,
          answer: aiResponse.content.length > 200 ? aiResponse.content.slice(0, 200) + '...' : aiResponse.content,
          source: 'Chat Conversation',
          concept: extractConcept(userQuestion),
          timeSpent: 0,
          correct: undefined,
          isStarred: false
        });
      }
    }
  });

  // Generate additional concept-based flashcards from AI responses
  const aiMessages = messages.filter(m => m.sender_type === 'ai');
  aiMessages.forEach((message, index) => {
    const content = message.content.toLowerCase();
    
    // Look for definition patterns
    if (content.includes('is defined as') || content.includes('refers to') || content.includes('means')) {
      const sentences = message.content.split('. ');
      sentences.forEach((sentence, sentenceIndex) => {
        if (sentence.toLowerCase().includes('is defined as') || 
            sentence.toLowerCase().includes('refers to') || 
            sentence.toLowerCase().includes('means')) {
          
          const parts = sentence.split(/(?:is defined as|refers to|means)/i);
          if (parts.length >= 2) {
            const term = parts[0].trim();
            const definition = parts[1].trim();
            
            if (term.length > 3 && definition.length > 10) {
              flashcards.push({
                id: `concept-flashcard-${index}-${sentenceIndex}`,
                question: `What ${term.toLowerCase().includes('what') ? 'is' : 'does'} ${term}?`,
                answer: definition.charAt(0).toUpperCase() + definition.slice(1),
                source: 'AI Explanation',
                concept: extractConcept(term),
                timeSpent: 0,
                correct: undefined,
                isStarred: false
              });
            }
          }
        }
      });
    }
  });

  return flashcards.slice(0, 10); // Limit to 10 flashcards for better UX
};

const extractConcept = (text: string): string => {
  const keywords = ['math', 'science', 'history', 'programming', 'language', 'physics', 'chemistry', 'biology', 'literature', 'art'];
  const lowerText = text.toLowerCase();
  
  for (const keyword of keywords) {
    if (lowerText.includes(keyword)) {
      return keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }
  }
  
  // Extract first noun-like word as concept
  const words = text.split(' ').filter(word => word.length > 3);
  return words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : 'General';
};

export function ChatFlashcardContainer({ messages }: ChatFlashcardContainerProps) {
  const generatedCards = useMemo(() => generateFlashcardsFromChat(messages), [messages]);
  
  const {
    cards,
    filteredCards,
    isShuffled,
    setFilteredCards,
    handleStarCard,
    handleUpdateCards,
    handleShuffle
  } = useFlashcardState(generatedCards);

  const {
    availableConcepts,
    hasStarredCards,
    handleFilter
  } = useFlashcardFilters(cards, setFilteredCards);

  const {
    showManagement,
    handleManageCards,
    handleEditCard,
    handleBackFromManagement
  } = useFlashcardManagement();

  const handleSaveCards = (updatedCards: FlashcardData[]) => {
    handleUpdateCards(updatedCards);
  };

  const handleGenerateMore = () => {
    // Generate additional flashcards (simulate AI generation)
    const newCards = [...cards];
    const conceptCounts = new Map<string, number>();
    
    // Count existing concepts
    cards.forEach(card => {
      if (card.concept) {
        conceptCounts.set(card.concept, (conceptCounts.get(card.concept) || 0) + 1);
      }
    });

    // Generate a few more flashcards based on conversation context
    if (messages.length > 0) {
      const lastAiMessage = messages.filter(m => m.sender_type === 'ai').pop();
      if (lastAiMessage) {
        newCards.push({
          id: `generated-${Date.now()}`,
          question: 'What was the main topic discussed in our recent conversation?',
          answer: lastAiMessage.content.slice(0, 150) + '...',
          source: 'AI Generated',
          concept: 'Conversation Review',
          timeSpent: 0,
          correct: undefined,
          isStarred: false
        });
      }
    }

    handleUpdateCards(newCards);
  };

  // Show management view
  if (showManagement) {
    return (
      <FlashcardManagement
        cards={cards}
        onBack={handleBackFromManagement}
        onSave={handleSaveCards}
        onUpdateCard={(index, updatedCard) => {
          console.log('Update card:', index, updatedCard);
        }}
      />
    );
  }

  // Show empty state if no flashcards generated
  if (cards.length === 0) {
    return (
      <div className="h-full p-4 flex flex-col items-center justify-center">
        <Brain className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-dashboard-text dark:text-dashboard-text mb-2">
          No Flashcards Yet
        </h3>
        <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-center max-w-md mb-6">
          Continue your conversation to automatically generate flashcards from your Q&A exchanges with the AI.
        </p>
        <Button 
          onClick={handleGenerateMore}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate Sample Cards
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        
        <Flashcard 
          cards={filteredCards} 
          onStar={handleStarCard} 
          onEdit={handleEditCard} 
          onManage={handleManageCards} 
          onFilter={handleFilter} 
          onShuffle={handleShuffle}
          onUpdateCards={handleUpdateCards}
        />
      </div>
    </ScrollArea>
  );
}