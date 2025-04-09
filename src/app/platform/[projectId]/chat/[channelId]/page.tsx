'use client';

import { useState, use, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faVideo, faPhone, faGear } from '@fortawesome/free-solid-svg-icons';
import { Message } from '@/types/Message';
import { TeamMember } from '@/types/Member';

interface PageProps {
  params: Promise<{
    channelId: string;
  }>;
}

export default function ChatPage({ params }: PageProps) {
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { channelId } = use(params);

  useEffect(() => {
    // 멤버 데이터 로드
    fetch('/json/members.json')
      .then(res => res.json())
      .then(data => setMembers(data));
  }, []);

  // 채널별 메시지 데이터
  const channelMessages: Record<string, Message[]> = {
    'general': [
      {
        id: '1',
        userId: 5,
        user: '홍길동',
        content: '안녕하세요! 오늘도 좋은 하루 보내세요.',
        timestamp: '오전 9:30',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=John'
      },
      {
        id: '2',
        userId: 1,
        user: '김철수',
        content: '네, 좋은 하루 되세요!',
        timestamp: '오전 9:32',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jane'
      }
    ],
    'announcement': [
      {
        id: '1',
        userId: 3,
        user: '프로젝트 관리자',
        content: '[공지] 이번 주 금요일 오후 2시에 전체 회의가 있습니다.',
        timestamp: '어제',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin'
      }
    ],
    'free-chat': [
      {
        id: '1',
        userId: 2,
        user: '이영희',
        content: '점심 뭐 드셨나요?',
        timestamp: '오후 1:15',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Young'
      },
      {
        id: '2',
        userId: 4,
        user: '박지성',
        content: '저는 오늘 샐러드요! 다이어트 중입니다 😊',
        timestamp: '오후 1:17',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Park'
      }
    ]
  };

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
      <div className="flex justify-between px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold"># {channelId}</h2>
        <div className="space-x-5 self-center">
          <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
          <FontAwesomeIcon icon={faVideo} className="text-gray-400" />
          <FontAwesomeIcon icon={faGear} className="text-gray-400" />
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-6">
          {currentMessages.map((msg) => {
            const member = getMemberById(msg.userId);
            return (
              <div key={msg.id} className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  {member?.abbreviation || '??'}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className="font-medium text-white">{member?.name || msg.user}</span>
                    <span className="text-xs text-gray-400">{member?.role}</span>
                    <span className="text-xs text-gray-400">{msg.timestamp}</span>
                  </div>
                  <div className="inline-block bg-gray-700 rounded-lg px-4 py-2 text-gray-100">
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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