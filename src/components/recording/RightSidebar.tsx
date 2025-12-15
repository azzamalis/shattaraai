import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, FileText, BookOpen, Brain, FileStack, CheckSquare, FileInput, Star } from "lucide-react";
import AIChat from "./AIChat";
import QuizPreferences from './QuizPreferences';
import Notes from '@/components/recording/Notes';

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [isRecording, setIsRecording] = useState(false);

  return <div className="h-full flex flex-col bg-background">
      <Tabs defaultValue="chat" onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
        <div className="py-3 px-4 border-b border-border/50">
          <TabsList className="w-fit mx-auto flex items-center gap-1 p-1.5 rounded-2xl border border-primary/10 bg-card">
            <TabsTrigger value="chat" className="px-3 py-1.5 rounded-lg text-sm font-normal">
              <div className="flex items-center gap-2">
                {activeTab === "chat" ? (
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
                Chat
              </div>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="px-3 py-1.5 rounded-lg text-sm font-normal">
              <div className="flex items-center gap-2">
                {activeTab === "flashcards" ? (
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                ) : (
                  <FileStack className="h-4 w-4" />
                )}
                Flashcards
              </div>
            </TabsTrigger>
            <TabsTrigger value="exams" className="px-3 py-1.5 rounded-lg text-sm font-normal">
              <div className="flex items-center gap-2">
                {activeTab === "exams" ? (
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                Exams
              </div>
            </TabsTrigger>
            <TabsTrigger value="summary" className="px-3 py-1.5 rounded-lg text-sm font-normal">
              <div className="flex items-center gap-2">
                {activeTab === "summary" ? (
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
                Summary
              </div>
            </TabsTrigger>
            <TabsTrigger value="notes" className="px-3 py-1.5 rounded-lg text-sm font-normal">
              <div className="flex items-center gap-2">
                {activeTab === "notes" ? (
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                Notes
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 overflow-hidden">
          <AIChat />
        </TabsContent>
        <TabsContent value="flashcards" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground space-y-4 p-4">
              <FileStack className="h-12 w-12 mb-2" />
              <p className="text-center max-w-md text-base">Ready to review the key concepts? I've got flashcards lined up to make memorization quick and easy.</p>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="exams" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <QuizPreferences />
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="summary" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground space-y-4 p-4">
              <BookOpen className="h-12 w-12 mb-2" />
              <p className="text-center max-w-md text-base">Want the short version before diving deep? I've prepped a crisp summary to save you time and focus your attention.</p>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="notes" className="flex-1 overflow-hidden">
          <Notes isRecording={isRecording} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default RightSidebar;