
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, X } from "lucide-react";

interface MicrophoneOption {
  id: string;
  label: string;
}

const MicrophoneSelector = () => {
  const [microphones, setMicrophones] = useState<MicrophoneOption[]>([
    { id: "default", label: "Default - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)" }
  ]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("default");

  // In a real app, we would use the Media Devices API to get available microphones
  const handleMicrophoneChange = (value: string) => {
    setSelectedMicrophone(value);
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border">
      <div className="flex items-center space-x-2 flex-grow">
        <Mic className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedMicrophone} onValueChange={handleMicrophoneChange}>
          <SelectTrigger className="w-full bg-transparent border-0 focus:ring-0 focus:ring-offset-0 py-0 h-auto">
            <SelectValue placeholder="Select microphone" />
          </SelectTrigger>
          <SelectContent>
            {microphones.map((mic) => (
              <SelectItem key={mic.id} value={mic.id}>
                {mic.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <button className="text-muted-foreground hover:text-foreground">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default MicrophoneSelector;
