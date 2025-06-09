
import React, { useState } from 'react';
import { X, Trash2, Star, Plus, GripVertical } from 'lucide-react';
import { FlashcardData } from '@/lib/flashcardTypes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ManageCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: FlashcardData[];
  onUpdateCards: (cards: FlashcardData[]) => void;
  starredCards: Set<string>;
  onToggleStar: (cardId: string) => void;
}

export function ManageCardsModal({
  isOpen,
  onClose,
  cards,
  onUpdateCards,
  starredCards,
  onToggleStar
}: ManageCardsModalProps) {
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newHint, setNewHint] = useState('');

  if (!isOpen) return null;

  const addNewCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    
    const newCard: FlashcardData = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      hint: newHint.trim() || undefined,
      isStarred: false,
      studied: false,
      timeSpent: 0,
      correct: null,
      createdAt: new Date().toISOString()
    };

    onUpdateCards([...cards, newCard]);
    setNewQuestion('');
    setNewAnswer('');
    setNewHint('');
  };

  const deleteCard = (cardId: string) => {
    onUpdateCards(cards.filter(card => card.id !== cardId));
  };

  const exportCards = () => {
    const csvContent = [
      ['Question', 'Answer', 'Hint', 'Concept', 'Starred', 'Studied'].join(','),
      ...cards.map(card => [
        `"${card.question}"`,
        `"${card.answer}"`,
        `"${card.hint || ''}"`,
        `"${card.concept || ''}"`,
        card.isStarred ? 'Yes' : 'No',
        card.studied ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const studiedCount = cards.filter(card => card.studied).length;
  const difficultCount = cards.filter(card => card.difficulty === 'hard').length;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-dashboard-bg dark:bg-dashboard-bg rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-dashboard-text">Manage Cards</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-dashboard-text-secondary hover:text-dashboard-text"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-dashboard-card rounded-xl">
              <div className="text-2xl font-bold text-primary">{cards.length}</div>
              <div className="text-sm text-dashboard-text-secondary">Total Cards</div>
            </div>
            <div className="text-center p-4 bg-dashboard-card rounded-xl">
              <div className="text-2xl font-bold text-yellow-500">{starredCards.size}</div>
              <div className="text-sm text-dashboard-text-secondary">Starred</div>
            </div>
            <div className="text-center p-4 bg-dashboard-card rounded-xl">
              <div className="text-2xl font-bold text-green-500">{studiedCount}</div>
              <div className="text-sm text-dashboard-text-secondary">Studied</div>
            </div>
            <div className="text-center p-4 bg-dashboard-card rounded-xl">
              <div className="text-2xl font-bold text-red-500">{difficultCount}</div>
              <div className="text-sm text-dashboard-text-secondary">Difficult</div>
            </div>
          </div>

          {/* Add New Card */}
          <div className="p-4 border border-border rounded-xl bg-dashboard-card">
            <h3 className="text-lg font-semibold mb-4 text-dashboard-text">Add New Card</h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Enter question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="min-h-[60px]"
              />
              <Textarea
                placeholder="Enter answer..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="min-h-[60px]"
              />
              <Textarea
                placeholder="Enter hint (optional)..."
                value={newHint}
                onChange={(e) => setNewHint(e.target.value)}
                className="min-h-[40px]"
              />
              <Button
                onClick={addNewCard}
                disabled={!newQuestion.trim() || !newAnswer.trim()}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-dashboard-text">All Cards ({cards.length})</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg bg-dashboard-card hover:bg-dashboard-card-hover transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-dashboard-text-secondary cursor-grab" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-dashboard-text truncate">{card.question}</div>
                    <div className="text-sm text-dashboard-text-secondary truncate">{card.answer}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleStar(card.id)}
                      className={cn(
                        "w-8 h-8",
                        starredCards.has(card.id) 
                          ? "text-yellow-500" 
                          : "text-dashboard-text-secondary"
                      )}
                    >
                      <Star className={cn(
                        "w-4 h-4",
                        starredCards.has(card.id) && "fill-current"
                      )} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCard(card.id)}
                      className="w-8 h-8 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={exportCards}
              disabled={cards.length === 0}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => {/* TODO: Implement import */}}
            >
              Import Cards
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to delete all cards?')) {
                  onUpdateCards([]);
                }
              }}
              disabled={cards.length === 0}
            >
              Delete All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
