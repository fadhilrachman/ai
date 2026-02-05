"use client";

import React, { useState, useCallback, useEffect, useMemo, Suspense } from "react";
import {
  Sidebar,
  ChatContainer,
  Message,
  DocumentReferenceModal,
} from "@/components/chat";
import { Button } from "antd";
import { message as antMessage } from "@/lib/antd-static";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import chatApi from "@/lib/chatApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Helper to group history by conversation_id
const processHistory = (historyItems: any[]) => {
  const conversationsMap = new Map();
  
  historyItems.forEach((item) => {
    if (!item.conversation_id) return;
    
    if (!conversationsMap.has(item.conversation_id)) {
      conversationsMap.set(item.conversation_id, {
        id: item.conversation_id,
        title: item.user_message.slice(0, 30) + (item.user_message.length > 30 ? "..." : ""),
        date: new Date(item.created_at).toISOString().split("T")[0],
        timestamp: new Date(item.created_at).getTime(),
      });
    }
  });

  return Array.from(conversationsMap.values()).sort((a, b) => b.timestamp - a.timestamp);
};

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default collapsed on mobile
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [modal, setModal] = useState({
    documentReferences: false,
  });

  // Handle desktop/mobile initial state
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setSidebarCollapsed(false);
    }
  }, []);

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Sync activeChatId from URL
  useEffect(() => {
    const paramId = searchParams.get("conversation_id");
    if (paramId && paramId !== activeChatId) {
      setActiveChatId(paramId);
    } else if (!paramId && activeChatId) {
      setActiveChatId(null);
    }
  }, [searchParams, activeChatId]);

  // Fetch History
  const { data: historyData } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      const response = await chatApi.get("/chat/history");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, 
  });

  const chatHistoryList = useMemo(() => {
    if (!historyData?.history) return [];
    return processHistory(historyData.history);
  }, [historyData]);

  // Transform history items into Messages
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    if (historyData?.history) {
      const isHistoryChat = historyData.history.some(
        (item: any) => item.conversation_id === activeChatId
      );

      if (isHistoryChat) {
        const filtered = historyData.history
          .filter((item: any) => item.conversation_id === activeChatId)
          .sort(
            (a: any, b: any) =>
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );

        const mappedMessages: Message[] = [];
        filtered.forEach((item: any) => {
          mappedMessages.push({
            id: `user-${item.id}`,
            role: "user",
            content: item.user_message,
            timestamp: new Date(item.created_at),
          });
          mappedMessages.push({
            id: `ai-${item.id}`,
            role: "assistant",
            content: item.response_text,
            timestamp: new Date(item.created_at),
            chartConfig: item.response_chart_json || undefined,
          });
        });
        setMessages(mappedMessages);
      }
    }
  }, [activeChatId, historyData]);

  // Send Mutation
  const sendMutation = useMutation({
    mutationFn: async (payload: { message: string; conversation_id?: string }) => {
      const response = await chatApi.post("/chat/", payload);
      return response.data;
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
        chartConfig: data.chart || undefined,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
    onError: (error: any) => {
      antMessage.error("Failed to send message.");
      console.error(error);
    },
  });

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || sendMutation.isPending) return;

    let currentConversationId = activeChatId;
    if (!currentConversationId) {
       currentConversationId = `conv-${Date.now()}`;
       setActiveChatId(currentConversationId); 
       router.push(`/?conversation_id=${currentConversationId}`);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    sendMutation.mutate({
      message: userMessage.content,
      conversation_id: currentConversationId,
    });
  }, [inputValue, sendMutation, activeChatId, router]);

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setInputValue("");
    router.push('/');
  }, [router]);

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id);
    router.push(`/?conversation_id=${id}`);
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  }, [router]);

  return (
    <div className="flex relative h-screen bg-[#343541] overflow-hidden">
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#343541] border-b border-[#4E4F60] z-30 flex items-center justify-between px-4">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setSidebarCollapsed(false)}
          className="!text-[#ECECF1]"
        />
        <div className="text-[#ECECF1] font-medium truncate max-w-[200px]">
          {activeChatId ? "Current Chat" : "New Chat"}
        </div>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={handleNewChat}
          className="!text-[#ECECF1]"
        />
      </div>

      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        chatHistory={chatHistoryList}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onLogout={handleLogout}
        onClose={() => setSidebarCollapsed(true)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 relative flex flex-col pt-14 md:pt-0">
        <ChatContainer
          messages={messages}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
          isLoading={sendMutation.isPending}
        />
        
        {/* Document Modal Toggle (Floating Button on Desktop, hidden or relocated on Mobile) */}
        {!modal.documentReferences && (
          <div className="fixed top-4 right-4 z-20">
              <Button
                type="primary"
                shape="round"
                icon={<MenuOutlined />}
                onClick={() => setModal({ documentReferences: true })}
                className="!bg-[#10A37F] hover:!bg-[#1ABC9C] border-none shadow-lg"
              >
                Docs
              </Button>
          </div>
        )}
      </div>

      <DocumentReferenceModal
        open={modal.documentReferences}
        onClose={() => setModal({ documentReferences: false })}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#343541] flex items-center justify-center text-[#ECECF1]">
        Loading...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
