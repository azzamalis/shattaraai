
import React, { useState } from 'react';
import { ManagementHeader } from './ManagementHeader';
import { ManagementCard } from './ManagementCard';
import { FlashcardData } from './Flashcard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FlashcardManagementProps {
  cards: FlashcardData[];
  onBack: () => void;
  onSave: (cards: FlashcardData[]) => void;
  onUpdateCard: (index: number, updatedCard: FlashcardData) => void;
}

export function FlashcardManagement({
  cards,
  onBack,
  onSave,
  onUpdateCard
}: FlashcardManagementProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [starredCards, setStarredCards] = useState<Set<string>>(new Set(cards.filter(card => card.isStarred).map(card => card.id)));
  const [managementCards, setManagementCards] = useState<FlashcardData[]>(cards);

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const toggleStar = (cardId: string) => {
    const newStarred = new Set(starredCards);
    if (newStarred.has(cardId)) {
      newStarred.delete(cardId);
    } else {
      newStarred.add(cardId);
    }
    setStarredCards(newStarred);

    const updatedCards = managementCards.map(card => 
      card.id === cardId ? { ...card, isStarred: newStarred.has(cardId) } : card
    );
    setManagementCards(updatedCards);
  };

  const handleUndoAll = () => {
    setManagementCards(cards);
    setStarredCards(new Set(cards.filter(card => card.isStarred).map(card => card.id)));
    setExpandedCards(new Set());
  };

  const handleDone = () => {
    onSave(managementCards);
    onBack();
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = managementCards.filter(card => card.id !== cardId);
    setManagementCards(updatedCards);
  };

  const handleAddCard = (afterIndex: number) => {
    const newCard: FlashcardData = {
      id: `new-${Date.now()}`,
      question: "New question",
      answer: "New answer",
      hint: "",
      explanation: "",
      source: "",
      concept: "",
      isStarred: false
    };
    const updatedCards = [...managementCards];
    updatedCards.splice(afterIndex + 1, 0, newCard);
    setManagementCards(updatedCards);
  };

  return (
    <div className="h-screen bg-dashboard-bg flex flex-col overflow-hidden">
      <ManagementHeader 
        onBack={onBack} 
        onUndoAll={handleUndoAll} 
        onDone={handleDone} 
      />

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="font-semibold text-dashboard-text mb-2 text-base">
                Manage Cards
              </h1>
              <p className="text-dashboard-text-secondary text-sm">
                Edit your flashcards, add new ones, or reorganize them
              </p>
            </div>
            
            <div className="space-y-6 pb-6">
              {managementCards.map((card, index) => (
                <ManagementCard
                  key={card.id}
                  card={card}
                  index={index}
                  isExpanded={expandedCards.has(card.id)}
                  isStarred={starredCards.has(card.id)}
                  onToggleExpansion={() => toggleCardExpansion(card.id)}
                  onToggleStar={() => toggleStar(card.id)}
                  onAddBelow={() => handleAddCard(index)}
                  onDelete={() => handleDeleteCard(card.id)}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
