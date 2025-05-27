
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
        className="bg-transparent text-dashboard-text/70 dark:text-white text-sm px-0 py-0 focus:outline-none focus:ring-0 border-none w-auto"
        style={{ boxShadow: 'none', appearance: 'none' }}
      >
        {microphones.map(mic => (
          <option key={mic} value={mic} className="bg-dashboard-card dark:bg-black text-dashboard-text dark:text-white">
            {mic}
          </option>
        ))}
      </select>
      {selected && onClear && (
        <button
          className="text-dashboard-text-secondary/70 dark:text-white/70 hover:text-dashboard-text dark:hover:text-white p-1 rounded-full hover:bg-dashboard-card-hover/50 dark:hover:bg-white/10 transition-colors"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
