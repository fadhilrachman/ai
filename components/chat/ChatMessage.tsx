"use client";

import React from "react";
import { Button, Tooltip, Avatar } from "antd";
import { CopyOutlined, CheckOutlined, UserOutlined } from "@ant-design/icons";
import ChartRenderer, { ChartConfig } from "./ChartRenderer";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  chartConfig?: ChartConfig;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === "user";

  return (
    <div
      className={`
        group flex gap-3 md:gap-4 px-3 md:px-4 py-4 md:py-6 w-full
        ${isUser ? "bg-transparent" : "bg-[#444654]/50"}
      `}
    >
      <div className="max-w-3xl mx-auto w-full flex gap-3 md:gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <Avatar
              size={32}
              icon={<UserOutlined />}
              className="!bg-[#5436DA] md:!w-[36px] md:!h-[36px]"
            />
          ) : (
            <div className="w-8 h-8 md:w-9 md:h-9" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isUser && (
            <div className="font-medium mb-1 text-[10px] md:text-xs">
              You
            </div>
          )}
          <div className="text-[#D1D5DB] text-sm md:text-base md:leading-7 break-words overflow-x-auto">
            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#2D2D3A] prose-pre:border prose-pre:border-[#565869] max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
          {message.chartConfig && (
            <div className="mt-4 w-full overflow-x-auto custom-scrollbar">
              <ChartRenderer config={message.chartConfig} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip title={copied ? "Copied!" : "Copy"}>
            <Button
              type="text"
              size="small"
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={handleCopy}
              className={`
                !text-[#8E8EA0] hover:!text-white hover:!bg-[#2D2D3A]
                ${copied ? "!text-[#10A37F]" : ""}
              `}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
