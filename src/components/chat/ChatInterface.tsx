
import React, { useState, useEffect, useRef } from 'react';
import { ChatTabType, Message } from '@/lib/types';
import { ChatTabNavigation } from './ChatTabNavigation';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { NotesEditor } from './NotesEditor/NotesEditor';
import { EmptyStates } from './EmptyStates';

interface ChatInterfaceProps {
  activeTab: ChatTabType;
  onTabChange: (tab: ChatTabType) => void;
  initialQuery?: string | null;
}

export function ChatInterface({ activeTab, onTabChange, initialQuery }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
      copyable: true
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuery && activeTab === 'chat') {
      setInputValue(initialQuery);
    }
  }, [initialQuery, activeTab]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about: "${content}". Let me help you with that!`,
        sender: 'ai',
        timestamp: new Date(),
        copyable: true
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue('');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <ChatMessages messages={messages} />
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-border p-4">
              <ChatInput 
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
              />
            </div>
          </div>
        );
      case 'notes':
        return <NotesEditor />;
      case 'flashcards':
      case 'quizzes':
        return <EmptyStates type={activeTab} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatTabNavigation activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
}
