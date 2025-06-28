interface TotalMemberCardProps {
  totalMemberCount: number;
  activeMemberCount: number;
}

export default function TotalMemberCard({ totalMemberCount, activeMemberCount }: TotalMemberCardProps) {
  return (
    <div className="bg-component-background rounded-lg shadow-sm p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <span className="text-text-primary text-sm font-semibold">활동 중인 팀원</span>
          <span className="text-text-primary text-3xl font-bold">
            {activeMemberCount || 0}
          </span>
        </div>
        <div className="bg-green-500/20 rounded-full p-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        </div>
      </div>
      <p className="text-xs text-text-secondary">{activeMemberCount / totalMemberCount * 100 || 0}% of Team</p>
    </div>
  )
}