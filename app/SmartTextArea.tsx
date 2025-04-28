"use client";

import { useRef } from "react";

interface SmartTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SmartTextArea({ value, onChange, placeholder }: SmartTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + "\t" + value.substring(end);
        onChange(newValue);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      rows={10}
      placeholder={placeholder || "Введите текст..."}
      className="border p-2 rounded w-full mb-2"
      style={{ overflow: "auto", whiteSpace: "pre-wrap" }}
    />
  );
}
