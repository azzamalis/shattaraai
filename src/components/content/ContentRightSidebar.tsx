
import React, { useState, useCallback } from 'react';
import { ContentData } from '@/pages/ContentPage';
import { ContentViewer } from './ContentViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, FileText, Lightbulb, BookOpen, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ContentRightSidebarProps {
  contentData: ContentData;
}

export function ContentRightSidebar({ contentData }: ContentRightSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTextAction = useCallback((action: 'explain' | 'search' | 'summarize', text: string) => {
    let prompt = '';
    switch (action) {
      case 'explain':
        prompt = `Explain: ${text}`;
        break;
      case 'search':
        prompt = `Search the web: ${text}`;
        break;
      case 'summarize':
        prompt = `Create a summary on: ${text}`;
        break;
    }
    
    setInputValue(prompt);
    
    // Auto-send the message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'll help you with that. Based on the selected text "${text}", here's my response for the ${action} action.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your question. Let me help you with that based on the content you're viewing.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  }, [inputValue]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="h-full flex flex-col bg-dashboard-card dark:bg-dashboard-card rounded-lg border border-dashboard-separator dark:border-dashboard-separator">
      <Tabs defaultValue="viewer" className="h-full flex flex-col">
        <div className="p-4 border-b border-dashboard-separator dark:border-dashboard-separator">
          <TabsList className="grid w-full grid-cols-4 bg-dashboard-bg dark:bg-dashboard-bg">
            <TabsTrigger value="viewer" className="text-xs">Viewer</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
            <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="viewer" className="h-full p-4 mt-0">
            <ContentViewer 
              contentData={contentData} 
              onUpdateContent={() => {}}
              onTextAction={handleTextAction}
            />
          </TabsContent>

          <TabsContent value="chat" className="h-full flex flex-col mt-0">
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-dashboard-separator dark:border-dashboard-separator">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-dashboard-text dark:text-dashboard-text">AI Assistant</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {contentData.type.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
                      <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-sm">
                        Ask me anything about your {contentData.type}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        <Button variant="outline" size="sm" onClick={() => setInputValue("Summarize this content")}>
                          <BookOpen className="w-4 h-4 mr-1" />
                          Summarize
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setInputValue("Explain the key concepts")}>
                          <Lightbulb className="w-4 h-4 mr-1" />
                          Explain
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setInputValue("Ask me questions about this")}>
                          <HelpCircle className="w-4 h-4 mr-1" />
                          Quiz me
                        </Button>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'ai' && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            message.sender === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-dashboard-bg dark:bg-dashboard-bg text-dashboard-text dark:text-dashboard-text border border-dashboard-separator dark:border-dashboard-separator'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {message.sender === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-dashboard-bg dark:bg-dashboard-bg flex items-center justify-center flex-shrink-0 border border-dashboard-separator dark:border-dashboard-separator">
                            <User className="w-4 h-4 text-dashboard-text dark:text-dashboard-text" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-dashboard-bg dark:bg-dashboard-bg text-dashboard-text dark:text-dashboard-text border border-dashboard-separator dark:border-dashboard-separator rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-dashboard-separator dark:border-dashboard-separator">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about this content..."
                    className="flex-1 bg-dashboard-bg dark:bg-dashboard-bg border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="h-full p-4 mt-0">
            <Card className="h-full bg-dashboard-bg dark:bg-dashboard-bg border-dashboard-separator dark:border-dashboard-separator">
              <CardHeader>
                <CardTitle className="text-lg text-dashboard-text dark:text-dashboard-text flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-sm">
                  Note-taking functionality coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="h-full p-4 mt-0">
            <Card className="h-full bg-dashboard-bg dark:bg-dashboard-bg border-dashboard-separator dark:border-dashboard-separator">
              <CardHeader>
                <CardTitle className="text-lg text-dashboard-text dark:text-dashboard-text flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-sm">
                  Content summary will be generated here...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
