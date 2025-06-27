import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
interface RecentItemEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: (e: React.MouseEvent) => void;
  onCancel: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
export const RecentItemEditor: React.FC<RecentItemEditorProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  onKeyDown
}) => {
  return <div className="flex items-center gap-2 flex-1">
      <Input value={value} onChange={e => onChange(e.target.value)} className="flex-1 h-8" autoFocus onKeyDown={onKeyDown} />
      <Button size="sm" onClick={onSave} className="h-8 w-8 p-0" variant="ghost">
        <Check className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
        <X className="h-4 w-4" />
      </Button>
    </div>;
};