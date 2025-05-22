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
  return <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l border-white/10 bg-black" closeButton={false}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Learn with Shattara AI Tutor</h3>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="text-[#4b4b4b]">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-[#00A3FF] text-white' : 'bg-[#4B4B4B] text-white'}`}>
                  {message.content}
                </div>
              </div>)}
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask anything..." className="border-white/10 text-white placeholder:text-white/50 bg-transparent" />
              <Button onClick={handleSendMessage} disabled={!input.trim()} className="bg-[#00A3FF] text-white hover:bg-[#00A3FF]/80">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
}