import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/Message';
import { useAuthStore } from '@/auth/authStore';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = useAuthStore(state => state.user);

  // 자동 스크롤 기능
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sort messages in chronological order (oldest first)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {sortedMessages.map((msg, index) => {
        const isCurrentUser = msg.userId === currentUser?.id;
        const isSystemMessage = msg.type === 'system';

        if (isSystemMessage) {
          return (
            <div key={`${msg.id}-${index}`} className="flex justify-center my-2">
              <div className="bg-gray-100 text-gray-600 text-sm py-1 px-3 rounded-full">
                {msg.message}
              </div>
            </div>
          );
        }

        return (
          <div 
            key={`${msg.id}-${index}`} 
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                isCurrentUser 
                  ? 'bg-blue-500 text-white rounded-tr-none' 
                  : 'bg-component-secondary-background border border-component-border rounded-tl-none'
              }`}
            >
              {!isCurrentUser && (
                <div className="font-semibold text-sm">{msg.user}</div>
              )}
              <div className="break-words">{msg.message}</div>
              <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
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
