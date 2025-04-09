import { Message } from '@/types/Message';
import { TeamMember } from '@/types/Member';

interface MessageListProps {
  messages: Message[];
  getMemberById: (userId: number) => TeamMember | undefined;
}

export default function MessageList({ messages, getMemberById }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="space-y-6">
        {messages.map((msg) => {
          const member = getMemberById(msg.userId);
          return (
            <div key={msg.id} className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                {member?.name.charAt(0)}
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
  );
}
