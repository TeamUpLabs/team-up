interface MilestoneCardProps {
  milestone: {
    id: number;
    title: string;
    status: string;
    description: string;
    progress: number;
    startDate: string;
    endDate: string;
    assignee: string;
  }
}

export default function MilestoneCard({ milestone }: MilestoneCardProps) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-6 hover:bg-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          milestone.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
          milestone.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {milestone.status === 'completed' ? '완료' : 
           milestone.status === 'in-progress' ? '진행중' : '시작 전'}
        </span>
      </div>
      <p className="text-gray-400 mb-4">{milestone.description}</p>
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>진행률</span>
          <span>{milestone.progress}%</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <div className="text-gray-400">
          <p>시작일: {milestone.startDate}</p>
          <p>종료일: {milestone.endDate}</p>
        </div>
        <div className="text-gray-400">
          <p>담당자:</p>
          <p className="text-indigo-400">{milestone.assignee}</p>
        </div>
      </div>
    </div>
  );
}
