'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Message } from '@/types/Message';
import ChannelHeader from '@/components/project/chat/ChannelHeader';
import MessageList from '@/components/project/chat/MessageList';
import { useWebSocket } from '@/hooks/useWebSocket';
import { getCurrentKoreanTime } from '@/utils/dateUtils';
import { useAuthStore } from '@/auth/authStore';
import { useProject } from '@/contexts/ProjectContext';

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}


export default function ChatPage({ params }: PageProps) {
  const { project } = useProject();
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const { projectId } = use(params);
  const channelId = searchParams?.get('channel') || 'general';
  const channel = project?.channels?.find((c) => c.channelId === channelId);
  const { messages, sendMessage, isConnected } = useWebSocket(projectId, channelId);
  const [searchQuery, setSearchQuery] = useState("");
  const isMounted = useRef(false);

  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const searchValue = customEvent.detail || "";

      // Only update if value is different
      if (searchValue !== searchQuery) {
        setSearchQuery(searchValue);
      }
    };

    // Add event listener
    window.addEventListener("headerSearch", handleHeaderSearch);

    return () => {
      window.removeEventListener("headerSearch", handleHeaderSearch);
    };
  }, [searchQuery]);

  // Set mounted flag
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && sendMessage && isConnected) {
      const messageData: Message = {
        id: Date.now(),
        projectId: projectId,
        channelId: channelId,
        userId: user?.id ?? 0,
        user: user?.name ?? '',
        message: message,
        timestamp: getCurrentKoreanTime(),
      };

      sendMessage(messageData);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* 채널 헤더 - 고정 */}
      <div className="top-0 bg-background">
        {channel ? (
          <>
            <ChannelHeader channel={channel} />
            {/* Connection Status */}
            {!isConnected && (
              <div className="bg-red-500 text-white px-4 py-2 text-center">
                연결이 끊어졌습니다. 재연결 시도중...
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-red-500">채널을 찾을 수 없습니다.</div>
        )}
      </div>

      {/* 메시지 리스트 - 스크롤 */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} searchQuery={searchQuery} />
      </div>

      {/* 메시지 입력 - 고정 */}
      <div className="px-6 py-4 border-t border-component-border bg-background">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isConnected ? "메시지를 입력하세요..." : "연결 대기 중..."}
            disabled={!isConnected}
            className="flex-1 bg-component-secondary-background border border-component-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isConnected}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:hover:bg-blue-500"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
}