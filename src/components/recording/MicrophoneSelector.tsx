
import React from 'react';
import { ChevronDown } from 'lucide-react';

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
    <div className="relative w-full">
      <select
        value={selected}
        onChange={e => onSelect(e.target.value)}
        className="w-full bg-dashboard-card hover:bg-dashboard-card-hover border border-dashboard-separator rounded-lg px-3 py-2 text-sm text-dashboard-text appearance-none focus:outline-none focus:ring-1 focus:ring-[#00A3FF] focus:border-[#00A3FF] transition-all duration-200"
      >
        {microphones.map(mic => (
          <option key={mic} value={mic} className="bg-dashboard-card text-dashboard-text">
            {mic}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dashboard-text-secondary pointer-events-none" />
    </div>
  );
}
