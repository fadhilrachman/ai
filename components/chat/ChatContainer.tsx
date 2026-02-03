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

const suggestedPrompts = [
  {
    icon: <ThunderboltOutlined className="text-[#10A37F]" />,
    title: "Explain a concept",
    subtitle: "in simple terms",
  },
  {
    icon: <EditOutlined className="text-[#F59E0B]" />,
    title: "Help me write",
    subtitle: "an email or essay",
  },
  {
    icon: <CodeOutlined className="text-[#3B82F6]" />,
    title: "Write code",
    subtitle: "for a specific task",
  },
  {
    icon: <QuestionCircleOutlined className="text-[#EC4899]" />,
    title: "Answer questions",
    subtitle: "about any topic",
  },
];

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

  const handleSuggestedClick = (prompt: string) => {
    if (onSuggestedPrompt) {
      onSuggestedPrompt(prompt);
    } else {
      onInputChange(prompt);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#343541] overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="h-full flex flex-col items-center justify-center px-4 py-8">
            <div className="w-16 h-16 rounded-full bg-[#10A37F] flex items-center justify-center mb-6 shadow-lg shadow-[#10A37F]/20">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4046-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6099-1.4997Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold  mb-2">
              How can I help you today?
            </h1>
            <p className="text-[#8E8EA0] text-center mb-8 max-w-md">
              I&apos;m AI, your AI assistant. Ask me anything, and I&apos;ll do
              my best to help.
            </p>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  type="text"
                  onClick={() =>
                    handleSuggestedClick(`${prompt.title} ${prompt.subtitle}`)
                  }
                  className={`
                    !h-auto !p-4 !rounded-xl !text-left
                    !bg-[#40414F] hover:!bg-[#4E4F60]
                    !border !border-[#565869] hover:!border-[#6E6E80]
                    transition-all duration-200
                    flex items-start gap-3
                  `}
                >
                  <span className="text-xl mt-0.5">{prompt.icon}</span>
                  <div className="flex flex-col">
                    <span className=" font-medium text-sm">{prompt.title}</span>
                    <span className="text-[#8E8EA0] text-xs">
                      {prompt.subtitle}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          // Messages List
          <div className="pb-32">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-4 px-4 py-6 bg-[#444654]">
                <div className="max-w-3xl mx-auto w-full flex gap-4">
                  <div className="w-9 h-9 rounded-sm bg-[#10A37F] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white animate-pulse"
                    >
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 bg-[#8E8EA0] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-[#8E8EA0] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-[#8E8EA0] rounded-full animate-bounce"
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
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#343541] via-[#343541] to-transparent pt-8">
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
