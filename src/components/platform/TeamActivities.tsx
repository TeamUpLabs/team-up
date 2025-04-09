import Link from "next/link";

interface TeamMember {
  id: number;
  name: string;
  abbreviation: string;
  role: string;
  currentTask: string;
  status: string;
  statusTime: string;
}

export default function TeamActivities({ projectId }: { projectId: string }) {
  const bgColors = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-teal-500'
  ];

  const getRandomColor = () => {
    return bgColors[Math.floor(Math.random() * bgColors.length)];
  };

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "김철수",
      abbreviation: "KS",
      role: "프론트엔드 개발자",
      currentTask: "UI 디자인 개선",
      status: "활성",
      statusTime: "2시간 접속중",
    },
    {
      id: 2,
      name: "이영희",
      abbreviation: "YH",
      role: "백엔드 개발자",
      currentTask: "API 개발",
      status: "자리비움",
      statusTime: "15분 전",
    },
    {
      id: 3,
      name: "박민준",
      abbreviation: "MJ",
      role: "디자이너",
      currentTask: "로고 디자인",
      status: "오프라인",
      statusTime: "3시간 전",
    },
    {
      id: 4,
      name: "최지우",
      abbreviation: "JW",
      role: "QA 엔지니어",
      currentTask: "테스트 케이스 작성",
      status: "활성",
      statusTime: "1시간 접속중",
    },
    {
      id: 5,
      name: "홍길동",
      abbreviation: "GD",
      role: "프로젝트 매니저",
      currentTask: "일정 조율",
      status: "자리비움",
      statusTime: "30분 전",
    },
  ]
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
                <div className={`w-10 h-10 ${getRandomColor()} rounded-full flex items-center justify-center text-white font-bold`}>
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