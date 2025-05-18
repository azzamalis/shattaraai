
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryHeader } from './HistoryHeader';
import { HistorySearch } from './HistorySearch';
import { HistoryFilter } from './HistoryFilter';
import { HistoryTable, HistoryItem } from './HistoryTable';
import { historyItems } from './historyData';
import { toast } from 'sonner';

export function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Filter history items based on search query and type filter
  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.room.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleItemClick = (id: string) => {
    console.log(`Navigating to item: ${id}`);
  };

  const handleClearHistory = () => {
    toast.info("History cleared successfully");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <HistoryHeader onClearHistory={handleClearHistory} />
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <HistorySearch 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
          
          <HistoryFilter 
            typeFilter={typeFilter} 
            onFilterChange={setTypeFilter} 
          />
        </div>
        
        <Card className="bg-[#1A1A1A] border-white/20 text-white">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">
              View and manage your recent interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <HistoryTable 
              items={filteredItems} 
              onItemClick={handleItemClick} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
