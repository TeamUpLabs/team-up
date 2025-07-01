import { Users } from "flowbite-react-icons/outline";

interface TotalMemberCardProps {
  totalMemberCount: number;
}

export default function TotalMemberCard({ totalMemberCount }: TotalMemberCardProps) {
  return (
    <div className="bg-component-background rounded-lg shadow-sm p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <span className="text-text-primary text-sm font-semibold">총 팀원</span>
          <span className="text-text-primary text-3xl font-bold">
            {totalMemberCount || 0}
          </span>
        </div>
        <div className="bg-blue-500/20 rounded-full p-2">
          <Users className="w-4 h-4 text-blue-500" />
        </div>
      </div>
      <p className="text-xs text-text-secondary">명</p>
    </div>
  )
}