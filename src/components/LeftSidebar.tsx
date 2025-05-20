
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers, FileText } from "lucide-react";

const LeftSidebar = ({ isRecording }: { isRecording: boolean }) => {
  const [activeTab, setActiveTab] = useState("chapters");

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="sticky top-0 z-10 bg-background">
        <Tabs defaultValue="chapters" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none gap-2 p-2">
            <TabsTrigger
              value="chapters"
              className={`data-[state=active]:bg-transparent px-4 py-2 ${
                activeTab === "chapters" ? "active-tab" : ""
              }`}
            >
              <Layers className="h-4 w-4 mr-2" />
              Chapters
            </TabsTrigger>
            <TabsTrigger
              value="transcripts"
              className={`data-[state=active]:bg-transparent px-4 py-2 ${
                activeTab === "transcripts" ? "active-tab" : ""
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Transcripts
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="chapters" value={activeTab} className="w-full h-full">
          <TabsContent value="chapters" className="h-full p-0 m-0">
            <div className="p-4 flex items-center justify-center h-[400px] text-sm text-muted-foreground">
              {isRecording ? (
                <div className="animate-pulse">Recording chapters...</div>
              ) : (
                "Start recording to view chapters"
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="transcripts" className="h-full p-0 m-0">
            <div className="p-4 flex items-center justify-center h-[400px] text-sm text-muted-foreground">
              {isRecording ? (
                <div className="animate-pulse">Transcribing audio...</div>
              ) : (
                "Start recording to view transcripts"
              )}
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};

export default LeftSidebar;
