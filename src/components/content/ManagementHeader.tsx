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
  return <div className="flex items-center justify-between p-6 bg-background ">
      <button onClick={onBack} className="flex items-center gap-2 text-dashboard-text-secondary hover:text-dashboard-text transition-colors px-3 py-2 rounded-lg hover:bg-dashboard-bg text-sm">
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Go Back</span>
      </button>
      
      <div className="flex items-center gap-3">
        <button onClick={onUndoAll} className="flex items-center gap-2 px-4 py-2 text-dashboard-text-secondary hover:text-dashboard-text transition-colors border border-dashboard-separator/20 rounded-lg hover:bg-dashboard-bg font-medium text-sm">
          <Trash2 className="w-4 h-4" />
          <span>Undo All</span>
        </button>
        <Button onClick={onDone} className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors shadow-sm font-medium text-sm">
          Done
        </Button>
      </div>
    </div>;
}