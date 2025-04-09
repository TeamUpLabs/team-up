import Link from "next/link";
import TeamMembersData from "../../../public/json/members.json"
import { TeamMember } from "@/types/Member";

export default function TeamActivities({ projectId }: { projectId: string }) {
  const bgColors = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-teal-500'
  ];

  const getColorForMember = (memberId: number) => {
    return bgColors[memberId % bgColors.length];
  };

  const teamMembers: TeamMember[] = TeamMembersData;

  return (
    <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">팀원 활동</h2>
        <Link href={`/platform/${projectId}/members`} className="flex items-center text-gray-400 hover:text-gray-300">
          더보기
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="space-y-3 sm:space-y-4 max-h-[300px] overflow-y-auto">
        {
          teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${getColorForMember(member.id)} rounded-full flex items-center justify-center text-white font-bold`}>
                  {member.abbreviation}
                </div>
                <div className="ml-3">
                  <p className="text-white">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.role}</p>
                  <p className="text-xs text-gray-500">현재 작업: {member.currentTask}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <span className={`w-3 h-3 bg-${member.status === "활성"
                      ? "green"
                      : member.status === "자리비움"
                        ? "yellow"
                        : "gray"
                    }-500 rounded-full`}></span>
                  <span className="ml-2 text-gray-300">{member.status}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">{member.statusTime}</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}