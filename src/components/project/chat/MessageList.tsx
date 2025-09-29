import React, { useEffect, useRef } from 'react';
import { Chat } from '@/types/Chat';
import { useAuthStore } from '@/auth/authStore';
import Image from 'next/image';

interface MessageListProps {
  messages: Chat[];
  searchQuery: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, searchQuery }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore(state => state.user);

  // 자동 스크롤 기능
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sort messages in chronological order (oldest first)
  const sortedMessages = [...messages].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const filteredMessages = sortedMessages.filter((msg) => {
    const messageText = msg.message ?? '';
    const userName = msg.user?.name ?? '';
    const matchesSearch =
      messageText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {filteredMessages.map((msg, index) => {
        const isCurrentUser = msg.user_id === user?.id;

        return (
          <div
            key={`${msg.id}-${index}`}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-2">
              {!isCurrentUser && (
                <Image
                  src={msg.user?.profile_image || '/DefaultProfile.jpg'}
                  alt={msg.user?.name || ''}
                  width={48}
                  height={48}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="flex flex-col gap-1">
                {!isCurrentUser && (
                  <div className="font-semibold text-sm">{msg.user?.name}</div>
                )}
                <div
                  className={`px-4 py-2 rounded-lg whitespace-nowrap justify-self-end
                    ${isCurrentUser ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-component-secondary-background border border-component-border rounded-tl-none'
                    }`}
                >
                  <div className="break-words">{msg.message}</div>
                  <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
