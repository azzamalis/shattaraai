
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface ContentTableHeaderProps {
  showSelectionColumn?: boolean;
  allSelected?: boolean;
  onSelectAll?: () => void;
}

export function ContentTableHeader({ 
  showSelectionColumn, 
  allSelected, 
  onSelectAll 
}: ContentTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        {showSelectionColumn && (
          <TableHead className="w-12">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
          </TableHead>
        )}
        <TableHead>Title</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Created</TableHead>
        <TableHead className="w-12"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
