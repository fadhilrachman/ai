"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "antd";
import { SendOutlined, LoadingOutlined } from "@ant-design/icons";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading = false,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 768) {
      e.preventDefault();
      if (value.trim() && !isLoading && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-4">
      <div
        className={`
          relative flex items-end gap-2 p-2 md:p-3 rounded-xl md:rounded-2xl
          bg-[#40414F] border border-[#565869]
          focus-within:border-[#10A37F] 
          transition-all duration-200
        `}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan sesuatu ke Arna Tech..."
          disabled={disabled || isLoading}
          rows={1}
          className={`
            flex-1 resize-none bg-transparent border-none outline-none
            placeholder-[#8E8EA0] text-[#ECECF1]
            text-sm md:text-base leading-6 max-h-[150px] md:max-h-[200px]
            disabled:opacity-50 disabled:cursor-not-allowed
            py-1 md:py-0
          `}
        />
        <Button
          type="primary"
          icon={isLoading ? <LoadingOutlined spin /> : <SendOutlined />}
          onClick={onSend}
          disabled={!value.trim() || isLoading || disabled}
          className={`
            !flex-shrink-0 !w-8 !h-8 md:!w-9 md:!h-9 !p-0 !rounded-lg
            !bg-[#10A37F] hover:!bg-[#1ABC9C]
            disabled:!bg-[#565869] disabled:!text-[#8E8EA0]
            disabled:hover:!bg-[#565869]
            transition-all duration-200
            flex items-center justify-center
          `}
        />
      </div>
      <div className="text-center text-[10px] md:text-xs text-[#8E8EA0] mt-2 px-4 line-clamp-1 md:line-clamp-none">
        AI can make mistakes. Consider checking important information.
      </div>
    </div>
  );
};

export default ChatInput;
