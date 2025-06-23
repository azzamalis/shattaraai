
import React from 'react';
import { X } from 'lucide-react';

interface MicrophoneSelectorProps {
  selected: string;
  onSelect: (value: string) => void;
  onClear?: () => void;
}

export function MicrophoneSelector({ selected, onSelect, onClear }: MicrophoneSelectorProps) {
  // Mocked list of microphones
  const microphones = [
    "Default - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)",
    "Headset Microphone",
    "External USB Microphone",
    "Bluetooth Headset"
  ];

  return (
    <div className="flex items-center gap-2 w-full">
      <select
        value={selected}
        onChange={e => onSelect(e.target.value)}
        className="bg-transparent text-dashboard-text-secondary/80 dark:text-dashboard-text-secondary/80 text-xs px-0 py-1 focus:outline-none focus:ring-0 border-none w-auto min-w-0 flex-1 truncate"
        style={{ boxShadow: 'none', appearance: 'none' }}
      >
        {microphones.map(mic => (
          <option key={mic} value={mic} className="bg-dashboard-card dark:bg-dashboard-card text-dashboard-text dark:text-dashboard-text text-xs">
            {mic}
          </option>
        ))}
      </select>
      {selected && onClear && (
        <button
          className="text-dashboard-text-secondary/50 dark:text-dashboard-text-secondary/50 hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary p-1 rounded-full hover:bg-dashboard-card-hover/30 dark:hover:bg-white/5 transition-colors shrink-0"
          onClick={onClear}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
