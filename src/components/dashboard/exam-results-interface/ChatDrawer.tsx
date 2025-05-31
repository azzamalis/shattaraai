
import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface ChatMessage {
  isUser: boolean;
  content: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuestionId: number | null;
}

export function ChatDrawer({ isOpen, onClose, currentQuestionId }: ChatDrawerProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && currentQuestionId) {
      setChatMessages([
        {
          isUser: false,
          content: `I'm here to help you understand question ${currentQuestionId}. What would you like to know?`
        }
      ]);
    }
  }, [isOpen, currentQuestionId]);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { isUser: true, content: chatInput }]);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        isUser: false, 
        content: 'This is a simulated AI tutor response. In a real implementation, this would connect to your AI service.' 
      }]);
    }, 1000);
    
    setChatInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="flex-1 bg-black/50" 
        onClick={onClose}
      />
      <div className="w-96 bg-card shadow-xl flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Space Chat</h2>
          <button 
            onClick={onClose}
            className="rounded-md p-1 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-foreground'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          <div ref={chatMessagesEndRef} />
        </div>
        
        {/* Input area at bottom */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
            />
            <button 
              onClick={sendMessage}
              className="rounded-lg bg-primary px-3 py-2 hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
