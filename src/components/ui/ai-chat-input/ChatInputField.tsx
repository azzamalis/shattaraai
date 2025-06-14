
import React from "react";
import { PlaceholderText } from "./PlaceholderText";

interface ChatInputFieldProps {
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  onInputChange: (value: string) => void;
  placeholderText: string;
  showPlaceholder: boolean;
  isActive: boolean;
}

export const ChatInputField: React.FC<ChatInputFieldProps> = ({
  inputRef,
  inputValue,
  onInputChange,
  placeholderText,
  showPlaceholder,
  isActive
}) => {
  return (
    <div className="relative flex-1">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={e => onInputChange(e.target.value)}
        className="flex-1 border-0 outline-none rounded-md py-2 text-base bg-transparent w-full font-normal text-foreground focus:outline-none focus:ring-0 focus:border-0"
        style={{
          position: "relative",
          zIndex: 1
        }}
      />
      <PlaceholderText
        text={placeholderText}
        showPlaceholder={showPlaceholder}
        isActive={isActive}
        inputValue={inputValue}
      />
    </div>
  );
};
