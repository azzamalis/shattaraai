
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
        className="bg-popover border border-border text-popover-foreground text-xs px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring w-auto min-w-0 flex-1 truncate z-50"
        style={{ appearance: 'none' }}
      >
        {microphones.map(mic => (
          <option key={mic} value={mic} className="bg-popover text-popover-foreground text-xs py-1">
            {mic}
          </option>
        ))}
      </select>
      {selected && onClear && (
        <button
          className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-accent transition-colors shrink-0"
          onClick={onClear}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
