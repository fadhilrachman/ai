"use client";

import React, { useRef, useEffect } from "react";
import ChatMessage, { Message } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Button } from "antd";
import {
  ThunderboltOutlined,
  EditOutlined,
  CodeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

interface ChatContainerProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  onSuggestedPrompt?: (prompt: string) => void;
}



const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSend,
  isLoading = false,
  onSuggestedPrompt,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  return (
    <div className="flex-1 flex flex-col h-full bg-[#343541] overflow-hidden relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="min-h-full flex flex-col items-center justify-center px-4 py-12 md:py-8">
            <div className="mb-6 flex flex-col items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mb-4 bg-white rounded-3xl p-4 shadow-inner">
                <img
                  src="/icon.png"
                  alt="Arna Tech Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white">
              Ada yang bisa kami bantu?
            </h2>
            <p className="text-[#8E8EA0] text-center mb-8 max-w-sm md:max-w-md text-sm md:text-base">
              Tanyakan apa saja seputar dokumen atau knowledge base yang Anda
              miliki.
            </p>

            {/* Informational Instructions */}
            <div className="w-full max-w-xl px-4">
              <div
                className={`
                  p-4 md:p-6 rounded-2xl text-left
                  bg-[#40414F]/50 border border-[#565869]
                  flex items-center gap-4
                  shadow-sm
                `}
              >
                <div className="w-10 h-10 rounded-full bg-[#10A37F]/10 flex items-center justify-center flex-shrink-0">
                  <QuestionCircleOutlined className="text-xl text-[#10A37F]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm md:text-base text-white">
                    Panduan Penggunaan
                  </span>
                  <span className="text-[#8E8EA0] text-xs md:text-sm mt-1 leading-relaxed">
                    Untuk menambahkan atau mengelola dokumen referensi, Silahkan klik tombol <strong>"Docs"</strong> di pojok kanan atas.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Messages List
          <div className="pb-32 md:pb-40">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-4 px-4 py-6 bg-[#343541]">
                <div className="max-w-3xl mx-auto w-full flex gap-4">
                  <div className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0" />
                  <div className="flex items-center gap-1">
                    <div
                      className="w-1.5 h-1.5 bg-[#8E8EA0] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-[#8E8EA0] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-[#8E8EA0] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#343541] via-[#343541] to-transparent pt-6 pb-4 md:pb-6">
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
