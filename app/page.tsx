"use client";

import React, { useState, useCallback, useEffect, useMemo, Suspense } from "react";
import {
  Sidebar,
  ChatContainer,
  Message,
  DocumentReferenceModal,
  ChartConfig,
} from "@/components/chat";
import { Button } from "antd";
import { message as antMessage } from "@/lib/antd-static";
import { FileTextOutlined } from "@ant-design/icons";
import { documentReferences } from "@/lib/dummy";
import { useRouter, useSearchParams } from "next/navigation";
import chatApi from "@/lib/chatApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [modal, setModal] = useState({
    documentReferences: false,
  });

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Sync activeChatId from URL on mount/update
  useEffect(() => {
    const paramId = searchParams.get("conversation_id");
    if (paramId && paramId !== activeChatId) {
      setActiveChatId(paramId);
    } else if (!paramId && activeChatId) {
      // If URL has no ID but state does, clearing state might be intended 
      // ONLY if we want strictly URL driven. 
      // But let's assume if user hits back to root, we clear chat.
      setActiveChatId(null);
    }
  }, [searchParams, activeChatId]);

  // Fetch History
  const { data: historyData } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      try {
        const response = await chatApi.get("/chat/history");
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("access_token");
          router.push("/login");
        }
        throw error;
      }
    },
    // Refetch less often to save bandwidth, or rely on invalidation
    staleTime: 1000 * 60 * 5, 
  });

  const chatHistoryList = useMemo(() => {
    if (!historyData?.history) return [];
    return processHistory(historyData.history);
  }, [historyData]);

  // Transform history items into Messages when activeChatId changes
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
          // User message
          mappedMessages.push({
            id: `user-${item.id}`,
            role: "user",
            content: item.user_message,
            timestamp: new Date(item.created_at),
          });
          // AI response
          mappedMessages.push({
            id: `ai-${item.id}`,
            role: "assistant",
            content: item.response_text,
            timestamp: new Date(item.created_at), // Using same timestamp for simplicity or add offset
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
      return response.data; // { text, chart }
    },
    onSuccess: (data, variables) => {
      // Create assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
        chartConfig: data.chart || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Invalidate history query to update sidebar if needed
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
    onError: (error: any) => {
      antMessage.error("Failed to send message. Please try again.");
      console.error(error);
    },
  });

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || sendMutation.isPending) return;

    let currentConversationId = activeChatId;
    if (!currentConversationId) {
       currentConversationId = `conv-${Date.now()}`;
       // Update URL and State
       // Note: activeChatId state update via useEffect might be slightly delayed, 
       // but we need it here for the mutation.
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

  const handleSuggestedPrompt = useCallback((prompt: string) => {
    setInputValue(prompt);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  }, [router]);

  return (
    <div className="flex relative h-screen bg-[#343541] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        chatHistory={chatHistoryList}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onLogout={handleLogout}
      />

      {/* Main Chat Area */}
      <div className="flex-1 relative">
        <ChatContainer
          messages={messages}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
          isLoading={sendMutation.isPending}
          onSuggestedPrompt={handleSuggestedPrompt}
        />
      </div>
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => {
            setModal((p) => ({ ...p, documentReferences: true }));
          }}
          type="default"
          size="large"
          icon={<FileTextOutlined className="text-lg" />}
        >
          <span 
          // className="max-w-0 group-hover:max-w-xs transition-all duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap ml-0 group-hover:ml-2"
          >
            
            Document References
          </span>
        </Button>
      </div>

      <DocumentReferenceModal
        open={modal.documentReferences}
        onClose={() => {
          setModal((p) => ({ ...p, documentReferences: false }));
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#343541] text-[#ECECF1]">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
