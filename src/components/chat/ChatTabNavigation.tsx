
import React from 'react';
import { ChatTabType } from '@/lib/types';
import { MessageCircle, FileStack, Brain, FileText } from 'lucide-react';

interface ChatTabNavigationProps {
  activeTab: ChatTabType;
  onTabChange: (tab: ChatTabType) => void;
}

const tabs = [
  { id: 'chat' as ChatTabType, label: 'Chat', icon: MessageCircle },
  { id: 'flashcards' as ChatTabType, label: 'Flashcards', icon: FileStack },
  { id: 'quizzes' as ChatTabType, label: 'Quizzes', icon: Brain },
  { id: 'notes' as ChatTabType, label: 'Notes', icon: FileText },
];

export function ChatTabNavigation({ activeTab, onTabChange }: ChatTabNavigationProps) {
  return (
    <div className="border-b border-[#4B4B4B] bg-[#000]">
      <div className="flex w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors
                ${isActive 
                  ? 'text-[#FFF] bg-[#00A3FF]/10 border-b-2 border-[#00A3FF]' 
                  : 'text-[#A6A6A6] hover:text-[#FFF] hover:bg-[#DDDDDD]/10'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
