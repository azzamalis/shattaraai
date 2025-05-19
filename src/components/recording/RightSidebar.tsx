
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, FileText, BookOpen, HelpCircle, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  const handleSubmitChat = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    setMessages([...messages, { role: 'user', content: inputMessage }]);
    setInputMessage('');
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `This is a simulated response to: "${inputMessage}"` 
      }]);
    }, 1000);
  };
  
  return (
    <div className="h-full flex flex-col bg-[#111]">
      <Tabs 
        defaultValue="chat"
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        <TabsList className="justify-between bg-transparent border-b border-white/10 p-0 h-14">
          <TabsTrigger 
            value="chat"
            className="h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2323FF] data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="ml-2">Chat</span>
          </TabsTrigger>
          <TabsTrigger 
            value="flashcards"
            className="h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2323FF] data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <FileText className="h-5 w-5" />
            <span className="ml-2">Flashcards</span>
          </TabsTrigger>
          <TabsTrigger 
            value="quizzes"
            className="h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2323FF] data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="ml-2">Quizzes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="summary"
            className="h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2323FF] data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <BookOpen className="h-5 w-5" />
            <span className="ml-2">Summary</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notes"
            className="h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2323FF] data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <Edit className="h-5 w-5" />
            <span className="ml-2">Notes</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent 
          value="chat" 
          className="flex-1 flex flex-col p-0 h-[calc(100%-56px)]"
        >
          <div className="flex-1 flex flex-col overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-white/30" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Chat with the AI Tutor</h3>
                <p className="text-white/60 text-center max-w-md">
                  Ask anything or use the suggestions below
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg max-w-[85%] ${
                      msg.role === 'user' 
                        ? 'bg-[#2323FF]/20 ml-auto' 
                        : 'bg-white/10 mr-auto'
                    }`}
                  >
                    <p className="text-white">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 mt-auto">
            <div className="relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitChat();
                  }
                }}
                placeholder="Ask anything..."
                className="bg-black/30 border-white/10 text-white pr-20 pl-4 py-3 rounded-full"
              />
              <Button 
                onClick={handleSubmitChat}
                className="absolute right-1 top-1 h-8 rounded-full bg-[#2323FF]"
              >
                Send
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="flashcards" className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-white/60 text-center">
            <FileText className="h-12 w-12 mb-4 text-white/30" />
            <p className="font-medium text-white mb-1">No Flashcards Yet</p>
            <p className="text-sm">Flashcards will be generated after recording</p>
          </div>
        </TabsContent>
        
        <TabsContent value="quizzes" className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-white/60 text-center">
            <HelpCircle className="h-12 w-12 mb-4 text-white/30" />
            <p className="font-medium text-white mb-1">No Quizzes Yet</p>
            <p className="text-sm">Quizzes will be generated after recording</p>
          </div>
        </TabsContent>
        
        <TabsContent value="summary" className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-white/60 text-center">
            <BookOpen className="h-12 w-12 mb-4 text-white/30" />
            <p className="font-medium text-white mb-1">No Summary Yet</p>
            <p className="text-sm">Summary will be generated after recording</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-white/60 text-center">
            <Edit className="h-12 w-12 mb-4 text-white/30" />
            <p className="font-medium text-white mb-1">No Notes Yet</p>
            <p className="text-sm">Notes will be available after recording</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
