
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Plus, Search, Upload, Send, Mic, Box } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PasteContentModal } from '@/components/dashboard/PasteContentModal';
import { AIChatInput } from '@/components/ui/ai-chat';
import { toast } from "sonner";

export function Dashboard() {
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  const handlePasteSubmit = (data: { url?: string; text?: string }) => {
    // Handle the submitted data here
    if (data.url) {
      toast.success("URL content added successfully");
    } else if (data.text) {
      toast.success("Text content added successfully");
    }
  };

  const handleAISubmit = (value: string) => {
    toast.success("Your question was submitted");
    console.log("AI query:", value);
    // Here you would typically send the query to your AI backend
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-[#222222]">
        <div className="max-w-6xl mx-auto">
          {/* Practice with exams section - responsive padding */}
          <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
            <Button className="bg-transparent hover:bg-primary/10 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full border border-white/20 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base">
              <Badge className="bg-green-500 text-white mr-1 px-1.5 sm:px-2 py-0.5 text-xs font-bold rounded-full">NEW</Badge>
              Practice with exams
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
          </div>
          
          {/* Centered main heading with responsive font size */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 md:mb-12 text-center">What do you want to learn today?</h1>
          
          {/* Responsive grid for cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
            {/* Upload Document Card */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-transparent border-white/20 hover:border-primary transition-colors flex flex-col items-center p-4 md:p-6 text-center cursor-pointer">
                    <div className="mb-3 md:mb-4 bg-transparent border border-white/10 p-2 md:p-3 rounded-full">
                      <Upload className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <CardTitle className="text-white mb-1 md:mb-2 text-base md:text-lg">Upload</CardTitle>
                    <CardDescription className="text-gray-400 text-xs md:text-sm">File, Audio, Video</CardDescription>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] text-white border-white/10">
                  <p>Support file types: PDF, PPT, DOCX, TXT, Audio, Video</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Paste Text Card */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card 
                    className="bg-transparent border-white/20 hover:border-primary transition-colors flex flex-col items-center p-4 md:p-6 text-center cursor-pointer"
                    onClick={() => setIsPasteModalOpen(true)}
                  >
                    <div className="mb-3 md:mb-4 bg-transparent border border-white/10 p-2 md:p-3 rounded-full">
                      <FileText className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <CardTitle className="text-white mb-1 md:mb-2 text-base md:text-lg">Paste</CardTitle>
                    <CardDescription className="text-gray-400 text-xs md:text-sm">YouTube, Website, Text</CardDescription>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] text-white border-white/10">
                  <p>YouTube Link, Website URL, Docx, Video link, etc.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Record Audio Card */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-transparent border-white/20 hover:border-primary transition-colors flex flex-col items-center p-4 md:p-6 text-center cursor-pointer">
                    <div className="mb-3 md:mb-4 bg-transparent border border-white/10 p-2 md:p-3 rounded-full">
                      <Mic className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <CardTitle className="text-white mb-1 md:mb-2 text-base md:text-lg">Record</CardTitle>
                    <CardDescription className="text-gray-400 text-xs md:text-sm">Record Your Lecture</CardDescription>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] text-white border-white/10">
                  <p>Record your lectures in real-time</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* AI Assistant Input with enhanced focus states */}
          <div className="mb-6 sm:mb-8">
            <AIChatInput onSubmit={handleAISubmit} initialIsActive={false} />
          </div>

          {/* My Rooms section - responsive spacing and grid */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">My Rooms</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card className="bg-transparent border-white/20 hover:border-primary transition-colors p-3 sm:p-4">
                <div className="flex items-center">
                  <Box className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 sm:mr-3" />
                  <CardTitle className="text-white text-base sm:text-lg md:text-xl">Azzam's Room</CardTitle>
                </div>
              </Card>
              
              <Card className="bg-transparent border-white/20 hover:border-primary transition-colors p-3 sm:p-4">
                <div className="flex items-center">
                  <Box className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 sm:mr-3" />
                  <CardTitle className="text-white text-base sm:text-lg md:text-xl">Untitled Room</CardTitle>
                </div>
              </Card>
              
              <Card className="flex items-center justify-center border-white/20 border-dashed bg-transparent p-3 sm:p-4 hover:border-primary transition-colors cursor-pointer h-[50px] sm:h-[60px]">
                <div className="flex items-center text-white">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="text-white text-base sm:text-lg font-medium">Add a Room</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Paste Content Modal */}
      <PasteContentModal 
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onSubmit={handlePasteSubmit}
      />
    </div>
  );
}
