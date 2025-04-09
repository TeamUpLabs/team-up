import { TeamMember } from '@/types/Member';

interface MemberCardProps {
  member: TeamMember;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <div
      className="group bg-gray-800/90 backdrop-blur p-6 rounded-xl shadow-lg 
                hover:shadow-xl hover:scale-105 transition-all duration-300 
                border border-gray-700 hover:border-purple-500 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
            {member.name}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full">
            <span
              className={`w-3 h-3 rounded-full ${member.status === "활성" ? "bg-emerald-500" :
                  member.status === "자리비움" ? "bg-amber-500" : "bg-gray-500"
                } animate-pulse`}
            />
            <span className="ml-2 text-sm text-gray-300">{member.status}</span>
          </div>
          <span className="text-xs text-gray-500 mt-1">{member.statusTime}</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300">
            {member.role}
          </span>
        </div>
        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="text-sm">
            <span className="text-gray-400 font-medium">현재 작업</span>
            <div className="mt-2 p-3 bg-gray-700/30 rounded-lg text-gray-300">
              {member.currentTask}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
