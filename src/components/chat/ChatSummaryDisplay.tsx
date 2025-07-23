import React, { useState, useMemo } from 'react';
import { Copy, MessageSquare, Clock, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/hooks/useChatConversation';
import { formatDistanceToNow } from 'date-fns';

interface ChatSummaryItem {
  id: string;
  reference: string;
  title: string;
  summary: string[];
  timestamp: string;
  messageCount: number;
}

interface ChatSummaryDisplayProps {
  messages: ChatMessage[];
}

const generateChatSummary = (messages: ChatMessage[]): ChatSummaryItem[] => {
  if (messages.length === 0) {
    return [{
      id: 'empty',
      reference: 'No Messages',
      title: 'Start Conversation',
      summary: ['Begin chatting with Shattara AI to generate summaries', 'Your conversation topics and key insights will appear here'],
      timestamp: new Date().toISOString(),
      messageCount: 0
    }];
  }

  // Group messages by conversation topics (simple implementation)
  const conversationChunks: ChatMessage[][] = [];
  let currentChunk: ChatMessage[] = [];
  
  messages.forEach((message, index) => {
    if (message.sender_type === 'user') {
      if (currentChunk.length > 0) {
        conversationChunks.push([...currentChunk]);
        currentChunk = [];
      }
      currentChunk.push(message);
    } else if (message.sender_type === 'ai' && currentChunk.length > 0) {
      currentChunk.push(message);
    }
  });
  
  if (currentChunk.length > 0) {
    conversationChunks.push(currentChunk);
  }

  return conversationChunks.map((chunk, index) => {
    const userMessage = chunk.find(m => m.sender_type === 'user');
    const aiMessage = chunk.find(m => m.sender_type === 'ai');
    
    const title = userMessage?.content.slice(0, 50) + (userMessage?.content.length > 50 ? '...' : '') || 'Conversation Topic';
    const summary: string[] = [];
    
    if (userMessage) {
      summary.push(`User asked: "${userMessage.content.slice(0, 100)}${userMessage.content.length > 100 ? '...' : ''}"`);
    }
    
    if (aiMessage) {
      summary.push(`AI responded with guidance on the topic`);
      // Extract key points from AI response (simple keyword detection)
      const response = aiMessage.content.toLowerCase();
      if (response.includes('learn') || response.includes('study')) {
        summary.push('Learning recommendations provided');
      }
      if (response.includes('explain') || response.includes('understand')) {
        summary.push('Conceptual explanations given');
      }
      if (response.includes('example') || response.includes('instance')) {
        summary.push('Examples and illustrations shared');
      }
    }

    return {
      id: `chunk-${index}`,
      reference: `Topic ${index + 1}`,
      title,
      summary: summary.length > 0 ? summary : ['Conversation exchange recorded'],
      timestamp: chunk[0]?.created_at || new Date().toISOString(),
      messageCount: chunk.length
    };
  });
};

export function ChatSummaryDisplay({ messages }: ChatSummaryDisplayProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const summaryData = useMemo(() => generateChatSummary(messages), [messages]);
  
  const handleCopyAll = () => {
    const fullSummary = summaryData
      .filter(item => item.id !== 'empty')
      .map(item => `${item.title}\n${item.summary.map(point => `• ${point}`).join('\n')}`)
      .join('\n\n');
    
    if (fullSummary) {
      navigator.clipboard.writeText(fullSummary);
      console.log('Chat summary copied to clipboard');
    }
  };

  const handleCopyItem = (item: ChatSummaryItem) => {
    const itemText = `${item.title}\n${item.summary.map(point => `• ${point}`).join('\n')}`;
    navigator.clipboard.writeText(itemText);
    console.log('Item copied to clipboard');
  };

  const formatTimeReference = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-dashboard-text dark:text-dashboard-text">
            Conversation Summary
          </h2>
        </div>
        {summaryData.some(item => item.id !== 'empty') && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopyAll}
            className="text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:text-dashboard-text dark:hover:text-dashboard-text"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {summaryData.map(item => (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredCard(item.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="p-4 rounded-lg bg-card transition-colors hover:bg-card/80"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeReference(item.timestamp)}
                  </Badge>
                  {item.messageCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Hash className="h-3 w-3 mr-1" />
                      {item.messageCount} messages
                    </Badge>
                  )}
                </div>
                <h3 className="font-medium text-dashboard-text dark:text-dashboard-text text-base mb-2">
                  {item.title}
                </h3>
              </div>
              {hoveredCard === item.id && item.id !== 'empty' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyItem(item)}
                  className="text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:text-dashboard-text dark:hover:text-dashboard-text opacity-0 animate-fade-in"
                  style={{ opacity: 1 }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-1">
              {item.summary.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-dashboard-text-secondary/40 dark:bg-dashboard-text-secondary/40 mt-2 shrink-0" />
                  <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-sm leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}