import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ManagementHeaderProps {
  onBack: () => void;
  onUndoAll: () => void;
  onDone: () => void;
}
export function ManagementHeader({
  onBack,
  onUndoAll,
  onDone
}: ManagementHeaderProps) {
  return <div className="flex items-center justify-between p-6 border-b border-border bg-background ">
      <Button onClick={onBack} variant="default" className="flex items-center gap-2 px-3 py-2 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        <span>Go Back</span>
      </Button>
      
      <div className="flex items-center gap-3">
        <Button onClick={onUndoAll} variant="ghost" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
          <Trash2 className="w-4 h-4" />
          <span>Undo All</span>
        </Button>
        <Button onClick={onDone} variant="default" className="px-6 py-2 text-sm font-medium">
          Done
        </Button>
      </div>
    </div>;
}