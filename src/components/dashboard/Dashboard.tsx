import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Plus, Search, Upload, Send, Mic, Box } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function Dashboard() {
  return <div className="flex flex-col h-full">
      <main className="flex-1 overflow-auto p-6 bg-[#222222]">
        <div className="max-w-6xl mx-auto">
          {/* Practice with exams section - moved above the main heading */}
          <div className="mb-8 flex justify-center">
            <Button className="bg-transparent hover:bg-primary/10 text-white px-6 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <Badge className="bg-green-500 text-white mr-1 px-2 py-0.5 text-xs font-bold rounded-full">NEW</Badge>
              Practice with exams
              <BookOpen className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {/* Centered main heading with larger font size */}
          <h1 className="text-4xl font-bold text-white mb-12 text-center">What do you want to learn today?</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Upload Document Card */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-transparent border-white/20 hover:border-primary transition-colors flex flex-col items-center p-6 text-center cursor-pointer">
                    <div className="mb-4 bg-transparent border border-white/10 p-3 rounded-full">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-white mb-2">Upload</CardTitle>
                    <CardDescription className="text-gray-400">File, Audio, Video</CardDescription>
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
                  <Card className="bg-transparent border-white/20 hover:border-primary transition-colors flex flex-col items-center p-6 text-center cursor-pointer">
                    <div className="mb-4 bg-transparent border border-white/10 p-3 rounded-full">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-white mb-2">Paste</CardTitle>
                    <CardDescription className="text-gray-400">YouTube, Website, Text</CardDescription>
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
                  <Card className="bg-transparent border-white/20 hover:border-primary transition-colors flex flex-col items-center p-6 text-center cursor-pointer">
                    <div className="mb-4 bg-transparent border border-white/10 p-3 rounded-full">
                      <Mic className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-white mb-2">Record</CardTitle>
                    <CardDescription className="text-gray-400">Record Your Lecture</CardDescription>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] text-white border-white/10">
                  <p>Record your lectures in real-time</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* AI Assistant Input with Send icon */}
          <div className="mb-8">
            <div className="relative">
              <Input placeholder="Ask the AI assistant about any topic..." className="bg-transparent border-white/20 focus:border-primary text-white pl-6 pr-12 py-6 text-base" />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-light text-white h-9 w-9 p-0 flex items-center justify-center rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">My Rooms</h2>
              
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-transparent border-white/20 hover:border-primary transition-colors p-4">
                <div className="flex items-center">
                  <Box className="h-5 w-5 text-white mr-3" />
                  <CardTitle className="text-white text-xl">Azzam's Room</CardTitle>
                </div>
              </Card>
              
              <Card className="bg-transparent border-white/20 hover:border-primary transition-colors p-4">
                <div className="flex items-center">
                  <Box className="h-5 w-5 text-white mr-3" />
                  <CardTitle className="text-white text-xl">Untitled Space</CardTitle>
                </div>
              </Card>
              
              <Card className="flex items-center justify-center border-white/20 border-dashed bg-transparent p-4 hover:border-primary transition-colors cursor-pointer h-[60px]">
                <div className="flex items-center text-white">
                  <Plus className="h-5 w-5 mr-2" />
                  <span className="text-white text-lg font-medium">Add Space</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>;
}