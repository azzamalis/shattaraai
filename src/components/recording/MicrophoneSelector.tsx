
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface MicrophoneSelectorProps {
  selected: string;
  onSelect: (value: string) => void;
}

export function MicrophoneSelector({ selected, onSelect }: MicrophoneSelectorProps) {
  // Mocked list of microphones
  const microphones = [
    "Default - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)",
    "Headset Microphone",
    "External USB Microphone",
    "Bluetooth Headset"
  ];

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={selected} onValueChange={onSelect}>
        <SelectTrigger className="w-full bg-transparent border-white/20 text-white">
          <SelectValue placeholder="Select microphone" />
        </SelectTrigger>
        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
          {microphones.map((mic) => (
            <SelectItem key={mic} value={mic} className="hover:bg-white/10">
              {mic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selected && (
        <button className="text-white/70 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
