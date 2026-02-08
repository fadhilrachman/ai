"use client";

import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "antd";
import {
  PlusOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

interface ChatHistory {
  id: string;
  title: string;
  date: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  chatHistory: ChatHistory[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onLogout: () => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  chatHistory,
  activeChatId,
  onNewChat,
  onSelectChat,
  onLogout,
  onClose,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed md:relative z-50 flex flex-col h-screen bg-[#171717] border-r border-[#2D2D3A]
          transition-all duration-300 ease-in-out
          ${
            isMobile
              ? isCollapsed
                ? "-translate-x-full"
                : "translate-x-0 w-72"
              : isCollapsed
                ? "w-16"
                : "w-64"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-[#2D2D3A]">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg p-1">
                <img
                  src="/icon.png"
                  alt="Telkomsel"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-medium">Telkomsel</span>
            </div>
          )}
          {!isMobile && (
            <Button
              type="text"
              icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={onToggle}
              className="!text-[#8E8EA0] hover:!text-white hover:!bg-[#2D2D3A]"
            />
          )}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuFoldOutlined />}
              onClick={onClose}
              className="!text-[#8E8EA0] hover:!text-white hover:!bg-[#2D2D3A]"
            />
          )}
        </div>

        {/* New Chat Button */}
        <div
          className={`p-3 ${!isMobile && isCollapsed ? "flex justify-center" : ""}`}
        >
          <Tooltip
            title={!isMobile && isCollapsed ? "New Chat" : ""}
            placement="right"
          >
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => {
                onNewChat();
                if (isMobile) onClose?.();
              }}
              className={`
                !bg-transparent !border-[#4E4F60] !text-white
                hover:!bg-[#2D2D3A] hover:!border-[#565869]
                flex items-center ${!isMobile && isCollapsed ? "justify-center" : "justify-start"} gap-2
                !h-10 !rounded-lg
                ${!isMobile && isCollapsed ? "w-10 p-0" : "w-full"}
              `}
            >
              {(!isCollapsed || isMobile) && "New Chat"}
            </Button>
          </Tooltip>
        </div>

        {/* Chat History */}
        <div className={`flex-1 overflow-y-auto px-2 custom-scrollbar`}>
          {(!isCollapsed || isMobile) && chatHistory.length > 0 && (
            <div className="mb-2 px-2 text-xs text-[#8E8EA0] uppercase tracking-wider">
              Recent
            </div>
          )}
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <Tooltip
                key={chat.id}
                title={!isMobile && isCollapsed ? chat.title : ""}
                placement="right"
              >
                <div
                  onClick={() => {
                    onSelectChat(chat.id);
                    if (isMobile) onClose?.();
                  }}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                    transition-all duration-200
                    ${
                      activeChatId === chat.id
                        ? "bg-[#2D2D3A] text-white"
                        : "text-[#ACACBE] hover:bg-[#2D2D3A] hover:text-white"
                    }
                  `}
                >
                  <MessageOutlined className="text-sm flex-shrink-0" />
                  {(!isCollapsed || isMobile) && (
                    <span className="truncate text-sm">{chat.title}</span>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#2D2D3A]">
          <div className="space-y-1">
            <Tooltip
              title={!isMobile && isCollapsed ? "Settings" : ""}
              placement="right"
            >
              <div
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                  text-[#ACACBE] hover:bg-[#2D2D3A] hover:text-white
                  transition-all duration-200
                `}
              >
                <SettingOutlined className="text-sm flex-shrink-0" />
                {(!isCollapsed || isMobile) && (
                  <span className="text-sm">Settings</span>
                )}
              </div>
            </Tooltip>

            <Tooltip
              title={!isMobile && isCollapsed ? "Logout" : ""}
              placement="right"
            >
              <div
                onClick={onLogout}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                  text-[#ACACBE] hover:bg-red-500/10 hover:text-red-500
                  transition-all duration-200
                `}
              >
                <LogoutOutlined className="text-sm flex-shrink-0" />
                {(!isCollapsed || isMobile) && (
                  <span className="text-sm">Logout</span>
                )}
              </div>
            </Tooltip>

            <Tooltip
              title={!isMobile && isCollapsed ? "Profile" : ""}
              placement="right"
            >
              <div
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                  text-[#ACACBE] hover:bg-[#2D2D3A] hover:text-white
                  transition-all duration-200
                `}
              >
                <div className="w-6 h-6 rounded-full bg-[#10A37F] flex items-center justify-center flex-shrink-0">
                  <UserOutlined className="text-xs text-white" />
                </div>
                {(!isCollapsed || isMobile) && (
                  <span className="text-sm">User</span>
                )}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
