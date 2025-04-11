import { Message } from '@/types/Message';
import { TeamMember } from '@/types/Member';
import { getCurrentKoreanTimeDate } from '@/utils/dateUtils';

interface MessageListProps {
  messages: Message[];
  getMemberById: (userId: number) => TeamMember | undefined;
}

export default function MessageList({ messages, getMemberById }: MessageListProps) {
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    if (getCurrentKoreanTimeDate() === timestamp.split('T')[0]) {
      const time = timestamp.split('T')[1];
      const hours = parseInt(time.substring(0, 2));
      const minutes = time.substring(3, 5);
      
      const period = hours < 12 ? '오전' : '오후';
      const displayHours = hours <= 12 ? hours : hours - 12;
      
      return `${period} ${displayHours}:${minutes}`;
    }
  };

  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="space-y-6">
        {sortedMessages.map((msg) => {
          const member = getMemberById(msg.userId);
          return (
            <div key={`${msg.id}`} className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                {msg.user?.charAt(0) || '?'}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="font-medium text-white">{msg.user || 'Unknown User'}</span>
                  <span className="text-xs text-gray-400">{member?.role}</span>
                  <span className="text-xs text-gray-400">{formatTimestamp(msg.timestamp)}</span>
                </div>
                <div className="inline-block bg-gray-700 rounded-lg px-4 py-2 text-gray-100">
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
