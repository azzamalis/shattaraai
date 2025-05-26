
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Upload, Youtube, Link, AudioLines } from "lucide-react";
import { ContentViewer } from './ContentViewer';
import { RecordingControls } from '@/components/recording/RecordingControls';
import { MicrophoneSelector } from '@/components/recording/MicrophoneSelector';
import { ContentData } from '@/pages/ContentPage';

interface ContentLeftSidebarProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  isRecording: boolean;
  toggleRecording: () => void;
  recordingTime: string;
  selectedMicrophone: string;
  onMicrophoneSelect: (value: string) => void;
  onMicrophoneClear?: () => void;
}

const getTabIcon = (type: string) => {
  switch (type) {
    case 'recording':
      return AudioLines;
    case 'pdf':
    case 'upload':
      return Upload;
    case 'youtube':
      return Youtube;
    case 'website':
    case 'paste':
      return Link;
    default:
      return FileText;
  }
};

const getTabLabel = (type: string) => {
  switch (type) {
    case 'recording':
      return 'Recording';
    case 'pdf':
      return 'PDF';
    case 'upload':
      return 'Upload';
    case 'youtube':
      return 'YouTube';
    case 'website':
      return 'Website';
    case 'paste':
      return 'Paste';
    default:
      return 'Content';
  }
};

export function ContentLeftSidebar({
  contentData,
  onUpdateContent,
  isRecording,
  toggleRecording,
  recordingTime,
  selectedMicrophone,
  onMicrophoneSelect,
  onMicrophoneClear
}: ContentLeftSidebarProps) {
  const [activeTab, setActiveTab] = useState("content");
  const TabIcon = getTabIcon(contentData.type);

  return (
    <div className="h-full flex flex-col bg-dashboard-bg">
      <Tabs 
        defaultValue="content" 
        onValueChange={setActiveTab} 
        className="flex-1 flex flex-col h-full"
      >
        <div className="p-4 border-b border-dashboard-separator bg-dashboard-bg">
          <TabsList className="w-fit bg-dashboard-card border border-dashboard-separator rounded-lg p-1 h-auto">
            <TabsTrigger 
              value="content" 
              className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-dashboard-bg data-[state=active]:text-dashboard-text data-[state=active]:shadow-sm text-dashboard-text-secondary hover:text-dashboard-text transition-all duration-200"
            >
              <TabIcon className="h-4 w-4" />
              {getTabLabel(contentData.type)}
            </TabsTrigger>
            {contentData.type === 'recording' && (
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-dashboard-bg data-[state=active]:text-dashboard-text data-[state=active]:shadow-sm text-dashboard-text-secondary hover:text-dashboard-text transition-all duration-200"
              >
                Settings
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="content" className="flex-1 overflow-hidden m-0">
          <div className="h-full flex flex-col">
            {contentData.type === 'recording' && (
              <div className="p-4 border-b border-dashboard-separator bg-dashboard-bg">
                <div className="space-y-3">
                  <div className="text-sm text-dashboard-text-secondary">
                    Recording with:
                  </div>
                  <MicrophoneSelector
                    selected={selectedMicrophone}
                    onSelect={onMicrophoneSelect}
                    onClear={onMicrophoneClear}
                  />
                  <RecordingControls
                    isRecording={isRecording}
                    toggleRecording={toggleRecording}
                    recordingTime={recordingTime}
                  />
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-hidden">
              <ContentViewer contentData={contentData} />
            </div>
          </div>
        </TabsContent>

        {contentData.type === 'recording' && (
          <TabsContent value="settings" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <div className="text-dashboard-text font-medium">Recording Settings</div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-dashboard-text-secondary block mb-2">
                      Microphone
                    </label>
                    <MicrophoneSelector
                      selected={selectedMicrophone}
                      onSelect={onMicrophoneSelect}
                      onClear={onMicrophoneClear}
                    />
                  </div>
                  {/* Add more recording settings here as needed */}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
