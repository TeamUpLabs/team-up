'use client';

import { useState, use, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Message } from '@/types/Message';
import { TeamMember } from '@/types/Member';
import ChannelHeader from '@/components/project/chat/ChannelHeader';
import MessageList from '@/components/project/chat/MessageList';

interface PageProps {
  params: Promise<{
    channelId: string;
  }>;
}

export default function ChatPage({ params }: PageProps) {
  const [message, setMessage] = useState('');
  const [channelMessages, setChannelMessages] = useState<{[key: string]: Message[]}>({});
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { channelId } = use(params);

  useEffect(() => {
    // 멤버 데이터 로드
    fetch('/json/members.json')
      .then(res => res.json())
      .then(data => setMembers(data));

    // 메시지 데이터 로드
    fetch('/json/messages.json')
      .then(res => res.json())
      .then(data => setChannelMessages(data));
  }, []);

  // 현재 채널의 메시지 가져오기
  const currentMessages = channelMessages[channelId] || [];

  const getMemberById = (userId: number) => {
    return members.find(member => member.id === userId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // 메시지 전송 로직
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* 채널 헤더 */}
      <ChannelHeader channelId={channelId} />

      {/* 메시지 리스트 */}
      <MessageList messages={currentMessages} getMemberById={getMemberById} />

      {/* 메시지 입력 */}
      <div className="px-6 py-4 border-t border-gray-800">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
}