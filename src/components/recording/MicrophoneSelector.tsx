
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Mic } from 'lucide-react';

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
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Select defaultValue={selected} onValueChange={onSelect}>
          <SelectTrigger className="w-full bg-transparent border-white/20 text-white focus:ring-[#2323FF]/40">
            <Mic className="mr-2 h-4 w-4 text-white/70" />
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
      </div>
      
      {selected && onClear && (
        <button 
          className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
