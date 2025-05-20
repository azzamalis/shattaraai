
import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import HeaderControls from "./HeaderControls";

const RecordingHeader = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between w-full py-4 px-6 border-b border-border">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">
          Recording at {currentTime}
        </span>
        <button className="text-muted-foreground hover:text-foreground">
          <Pencil className="h-3 w-3" />
        </button>
      </div>

      <HeaderControls />
    </div>
  );
};

export default RecordingHeader;
