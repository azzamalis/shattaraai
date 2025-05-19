
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState("chapters");
  
  return (
    <div className="h-64 bg-black border-t border-white/10">
      <Tabs 
        defaultValue="chapters"
        onValueChange={setActiveTab}
        className="h-full"
      >
        <TabsList className="w-full bg-transparent border-b border-white/10 p-0 h-12">
          <TabsTrigger 
            value="chapters"
            className={`flex-1 h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent`}
          >
            <FileText className="mr-2 h-4 w-4" />
            Chapters
          </TabsTrigger>
          <TabsTrigger 
            value="transcripts"
            className={`flex-1 h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent`}
          >
            <FileText className="mr-2 h-4 w-4" />
            Transcripts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chapters" className="p-4 h-[calc(100%-48px)] overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <p>Chapters will appear here once recording starts</p>
          </div>
        </TabsContent>
        
        <TabsContent value="transcripts" className="p-4 h-[calc(100%-48px)] overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <p>Transcripts will appear here once recording starts</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
