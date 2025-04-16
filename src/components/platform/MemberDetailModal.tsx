import { TeamMember } from '@/types/Member';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface MemberDetailModalProps {
  member: TeamMember;
  cardPosition: { x: number; y: number; width: number; height: number };
  onClose: () => void;
}

export default function MemberDetailModal({ member, cardPosition, onClose }: MemberDetailModalProps) {
  const router = useRouter();
  const params = useParams();
  
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTaskClick = (taskId: string) => {
    localStorage.setItem('selectedTaskId', taskId);

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/tasks`);
    
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/0 backdrop-blur-none flex items-center justify-center z-50 
                 animate-[backdropFadeIn_0.3s_ease-out_forwards]"
      onClick={handleModalClick}
      style={{
        '--card-left': `${cardPosition.x}px`,
        '--card-top': `${cardPosition.y}px`,
        '--card-width': `${cardPosition.width}px`,
        '--card-height': `${cardPosition.height}px`,
        '--window-center-x': '50vw',
        '--window-center-y': '50vh',
      } as React.CSSProperties}
    >
      <div
        className="fixed bg-gray-800 rounded-xl shadow-2xl border border-gray-700
                   animate-[expandCard_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards] 
                   flex flex-col max-h-[90vh]"
      >
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-start p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                          flex items-center justify-center text-xl font-bold text-white">
                {member.name.charAt(0)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{member.name}</h2>
              <div className="flex items-center space-x-3">
                <div className="flex items-center px-2.5 py-1 rounded-full bg-gray-700/30 text-gray-300">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mr-2 ${member.status === "활성" ? "bg-emerald-500" :
                        member.status === "자리비움" ? "bg-amber-500" : "bg-gray-500"
                      } animate-pulse`}
                  />
                  <span className="text-sm">{member.status}</span>
                  <span className="text-sm text-gray-400">{member.statusTime}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 섹션 */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                역할
              </h3>
              <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300 font-medium">
                {member.role}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                부서
              </h3>
              <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300">
                {member.department}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                이메일
              </h3>
              <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300">
                {member.email}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                연락처
              </h3>
              <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300">
                {member.contactNumber}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2" />
              </svg>
              현재 작업
            </h3>
            <div className="px-4 py-3 bg-gray-700/30 rounded-lg">
              {
                member.currentTask.length > 0 ? (
                  member.currentTask.map((task, idx) => (
                    <p 
                      key={idx} 
                      className="text-gray-300 py-1 hover:text-blue-400 cursor-pointer transition-colors"
                      onClick={() => handleTaskClick(task.id)}
                    >
                      {task.title}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500">현재 작업이 없습니다</p>
                )
              }
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              스킬
            </h3>
            <div className="flex flex-wrap gap-2">
              {member.skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {skill}
                </span>
              )) || "등록된 스킬이 없습니다."}
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="border-t border-gray-700/50 p-6 mt-auto bg-gray-800">
          <button
            onClick={() => {
              if (confirm('정말로 이 팀원을 퇴출하시겠습니까?')) {
                console.log('팀원 퇴출:', member.name);
                onClose();
              }
            }}
            className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 
                     rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2
                     hover:text-red-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
            </svg>
            <span>팀원 퇴출</span>
          </button>
        </div>
      </div>
    </div>
  );
}
