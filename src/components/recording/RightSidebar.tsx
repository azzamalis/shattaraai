
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, FileText, BookOpen, HelpCircle, Edit } from 'lucide-react';

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState("chat");
  
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
            className="h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="ml-2">Chat</span>
          </TabsTrigger>
          <TabsTrigger 
            value="flashcards"
            className="h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <FileText className="h-5 w-5" />
            <span className="ml-2">Flashcards</span>
          </TabsTrigger>
          <TabsTrigger 
            value="quizzes"
            className="h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="ml-2">Quizzes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="summary"
            className="h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <BookOpen className="h-5 w-5" />
            <span className="ml-2">Summary</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notes"
            className="h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <Edit className="h-5 w-5" />
            <span className="ml-2">Notes</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent 
          value="chat" 
          className="flex-1 flex flex-col p-0 h-[calc(100%-56px)]"
        >
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Chat with the AI Tutor</h3>
            <p className="text-white/60 text-center max-w-md">
              Ask anything or use the suggestions below
            </p>
          </div>
          
          <div className="p-4 border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask anything..."
                className="w-full bg-[#1A1A1A] border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="flashcards" className="flex-1 flex items-center justify-center">
          <div className="text-white/60 text-center">
            <p>Flashcards will be generated after recording</p>
          </div>
        </TabsContent>
        
        <TabsContent value="quizzes" className="flex-1 flex items-center justify-center">
          <div className="text-white/60 text-center">
            <p>Quizzes will be generated after recording</p>
          </div>
        </TabsContent>
        
        <TabsContent value="summary" className="flex-1 flex items-center justify-center">
          <div className="text-white/60 text-center">
            <p>Summary will be generated after recording</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="flex-1 flex items-center justify-center">
          <div className="text-white/60 text-center">
            <p>Notes will be available after recording</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
