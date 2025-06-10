
import React, { useState } from 'react';
import { ArrowLeft, Star, Plus, GripVertical, Trash2, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardData } from './Flashcard';
import { cn } from '@/lib/utils';

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
  const [starredCards, setStarredCards] = useState<Set<string>>(
    new Set(cards.filter(card => card.isStarred).map(card => card.id))
  );
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

    // Update the card data
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

  const CardItem = ({ card, index }: { card: FlashcardData; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isExpanded = expandedCards.has(card.id);

    return (
      <div 
        className="relative bg-dashboard-card rounded-xl p-6 border border-dashboard-separator/20 hover:border-dashboard-separator/40 transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-dashboard-text-secondary text-sm font-medium">
              Card {index + 1}
            </span>
            <button 
              onClick={() => toggleStar(card.id)}
              className="p-1 hover:bg-dashboard-bg rounded-lg transition-colors"
            >
              <Star className={cn(
                "w-4 h-4 transition-colors",
                starredCards.has(card.id) 
                  ? "text-yellow-500 fill-yellow-500" 
                  : "text-dashboard-text-secondary hover:text-dashboard-text"
              )} />
            </button>
            {card.concept && (
              <span className="bg-dashboard-bg text-dashboard-text px-3 py-1 rounded-full text-xs font-medium border border-dashboard-separator/20">
                {card.concept}
              </span>
            )}
          </div>
          
          {isHovered && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleAddCard(index)}
                className="flex items-center gap-1 text-sm text-dashboard-text-secondary hover:text-dashboard-text transition-colors px-2 py-1 rounded-lg hover:bg-dashboard-bg"
              >
                <Plus className="w-4 h-4" />
                <span>Add below</span>
              </button>
              <button className="text-dashboard-text-secondary hover:text-dashboard-text cursor-move p-1 rounded-lg hover:bg-dashboard-bg transition-colors">
                <GripVertical className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeleteCard(card.id)}
                className="text-dashboard-text-secondary hover:text-red-400 p-1 rounded-lg hover:bg-dashboard-bg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-dashboard-text font-medium mb-3 text-sm">Term</h4>
            <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
              {card.question}
            </div>
          </div>

          <div>
            <h4 className="text-dashboard-text font-medium mb-3 text-sm">Definition</h4>
            <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
              {card.answer}
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-6 border-t border-dashboard-separator/20 pt-6">
              {card.hint && (
                <div>
                  <h4 className="text-dashboard-text font-medium mb-3 text-sm">Hint</h4>
                  <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
                    {card.hint}
                  </div>
                </div>
              )}

              {card.explanation && (
                <div>
                  <h4 className="text-dashboard-text font-medium mb-3 text-sm">Explanation</h4>
                  <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
                    {card.explanation}
                  </div>
                </div>
              )}

              {card.source && (
                <div>
                  <h4 className="text-dashboard-text font-medium mb-3 text-sm">Source</h4>
                  <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
                    {card.source}
                  </div>
                </div>
              )}

              {card.page && (
                <div>
                  <h4 className="text-dashboard-text font-medium mb-3 text-sm">Page</h4>
                  <div className="bg-dashboard-bg rounded-xl p-4 text-dashboard-text border border-dashboard-separator/20">
                    {card.page}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-dashboard-text font-medium mb-3 text-sm">Key concept</h4>
                <select className="w-full bg-dashboard-bg border border-dashboard-separator/20 rounded-xl p-4 text-dashboard-text focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/20 focus:border-[#00A3FF]/30 transition-all">
                  <option value={card.concept || ""}>{card.concept || "Select concept"}</option>
                  <option value="European Capitals">European Capitals</option>
                  <option value="Solar System">Solar System</option>
                  <option value="Chemical Formulas">Chemical Formulas</option>
                  <option value="Renaissance Art">Renaissance Art</option>
                  <option value="Asian Capitals">Asian Capitals</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => toggleCardExpansion(card.id)}
          className="text-dashboard-text-secondary text-sm mt-6 hover:text-dashboard-text transition-colors font-medium"
        >
          {isExpanded ? 'Show less' : 'Show more options'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-dashboard-separator/20 bg-dashboard-card">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-dashboard-text-secondary hover:text-dashboard-text transition-colors px-3 py-2 rounded-lg hover:bg-dashboard-bg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Go Back</span>
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleUndoAll}
            className="flex items-center gap-2 px-4 py-2 text-dashboard-text-secondary hover:text-dashboard-text transition-colors border border-dashboard-separator/20 rounded-lg hover:bg-dashboard-bg font-medium"
          >
            <Undo className="w-4 h-4" />
            <span>Undo All</span>
          </button>
          <Button 
            onClick={handleDone}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-sm"
          >
            Done
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-dashboard-text mb-2">Manage Cards</h1>
          <p className="text-dashboard-text-secondary">
            Edit your flashcards, add new ones, or reorganize them
          </p>
        </div>
        
        <div className="space-y-6">
          {managementCards.map((card, index) => (
            <CardItem key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
