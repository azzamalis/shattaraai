
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Plus, Search } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import Logo from '@/components/Logo';

export function Dashboard() {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center border-b border-gray-300 bg-dark-deeper p-4 sticky top-0 z-10">
        <div className="grid grid-cols-3 w-full items-center">
          {/* Left section with logo when sidebar is collapsed */}
          <div className="flex items-center">
            {!isExpanded && (
              <Logo className="h-10 w-auto" textColor="text-white" />
            )}
          </div>
          
          {/* Center section with search */}
          <div className="flex justify-center">
            <div className="relative w-64 lg:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search or use /commands" 
                className="pl-9 bg-dark h-9 border-gray-800 focus:border-primary text-white" 
              />
              <div className="absolute right-3 top-2.5 text-xs text-gray-500">⌘K</div>
            </div>
          </div>
          
          {/* Right section with upgrade button */}
          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary-light text-white">Upgrade</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 bg-[#222222]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">What do you want to learn today?</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Card className="bg-white border-gray-200 shadow-md hover:border-primary transition-colors">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-gray-800">Upload Document</CardTitle>
                <CardDescription className="text-gray-600">Import a PDF, Word, or text file</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white border-gray-200 shadow-md hover:border-primary transition-colors">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-gray-800">Link Resources</CardTitle>
                <CardDescription className="text-gray-600">Connect websites, articles or books</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-white border-gray-200 shadow-md hover:border-primary transition-colors">
              <CardHeader>
                <Search className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-gray-800">Explore Topics</CardTitle>
                <CardDescription className="text-gray-600">Browse recommended learning paths</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="mb-8">
            <div className="relative">
              <Input 
                placeholder="Ask the AI assistant about any topic..." 
                className="bg-white border-gray-300 focus:border-primary text-gray-800 pl-4 pr-32 py-6 text-base"
              />
              <Button className="absolute right-2 top-2 bg-primary hover:bg-primary-light text-white">
                Ask
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">My Spaces</h2>
              <Button variant="outline" className="border-gray-300 bg-white text-gray-800 hover:bg-white hover:text-primary hover:border-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Space
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-white border-gray-200 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-gray-800">Physics</CardTitle>
                  <CardDescription className="text-gray-600">Classical mechanics and kinematics</CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-gray-500 text-sm">3 documents • Last updated 2 days ago</p>
                </CardFooter>
              </Card>
              
              <Card className="bg-white border-gray-200 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-gray-800">Mathematics</CardTitle>
                  <CardDescription className="text-gray-600">Calculus and linear algebra</CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-gray-500 text-sm">5 documents • Last updated 1 week ago</p>
                </CardFooter>
              </Card>
              
              <Card className="flex items-center justify-center bg-white border-gray-200 border-dashed h-[168px] hover:border-primary transition-colors">
                <Button variant="ghost" className="text-primary flex flex-col items-center">
                  <Plus className="h-10 w-10 mb-2" />
                  <span>Add Space</span>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
