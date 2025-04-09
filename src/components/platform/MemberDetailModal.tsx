import { TeamMember } from '@/types/Member';

interface MemberDetailModalProps {
  member: TeamMember;
  cardPosition: { x: number; y: number; width: number; height: number };
  onClose: () => void;
}

export default function MemberDetailModal({ member, cardPosition, onClose }: MemberDetailModalProps) {
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
                   animate-[expandCard_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards] overflow-hidden"
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
                    className={`w-2.5 h-2.5 rounded-full mr-2 ${
                      member.status === "활성" ? "bg-emerald-500" : 
                      member.status === "자리비움" ? "bg-amber-500" : "bg-gray-500"
                    } animate-pulse`}
                  />
                  <span className="text-sm">{member.status}</span>
                  <span className="mx-2 text-gray-600">·</span>
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
        <div className="p-6 space-y-6">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              현재 작업
            </h3>
            <div className="px-4 py-3 bg-gray-700/30 rounded-lg text-gray-300">
              {member.currentTask}
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="border-t border-gray-700/50 p-6 bg-gray-800/50">
          <button
            onClick={() => {
              if (confirm('정말로 이 팀원을 퇴출하시겠습니까?')) {
                console.log('팀원 퇴출:', member.name);
                onClose();
              }
            }}
            className="w-full px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 
                     rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
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
