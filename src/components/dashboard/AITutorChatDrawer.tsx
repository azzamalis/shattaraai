
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Sheet, SheetContent, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AITutorChatDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AITutorChatDrawer({
  open,
  onOpenChange
}: AITutorChatDrawerProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m Shattara AI Tutor. How can I help you learn today?'
  }]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll help you understand about "${input}". What specific aspects would you like to explore?`
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] p-0 border-l border-dashboard-separator bg-dashboard-bg"
        closeButton={false}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-dashboard-separator bg-dashboard-bg">
            <h3 className="text-lg font-semibold text-dashboard-text">Learn with Shattara AI Tutor</h3>
            <SheetClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-dashboard-text-secondary hover:text-dashboard-text hover:bg-dashboard-card-hover transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-dashboard-bg">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-[#00A3FF] text-white' 
                      : 'bg-dashboard-card text-dashboard-text border border-dashboard-separator'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="p-6 border-t border-dashboard-separator bg-dashboard-bg">
            <div className="flex gap-3">
              <Input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={handleKeyDown} 
                placeholder="Ask anything..." 
                className="
                  flex-1 border-dashboard-separator text-dashboard-text 
                  placeholder:text-dashboard-text-secondary 
                  bg-dashboard-card hover:bg-dashboard-card-hover
                  focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF] 
                  transition-all duration-200
                " 
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim()} 
                className="
                  bg-[#00A3FF] text-white hover:bg-[#00A3FF]/90 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 hover:shadow-sm
                "
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
