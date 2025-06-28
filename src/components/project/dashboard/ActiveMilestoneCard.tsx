import { Flag } from "flowbite-react-icons/solid";

interface ActiveMilestoneCardProps {
  activeMilestoneCount: number;
  isLoading?: boolean;
}

export default function ActiveMilestoneCard({ activeMilestoneCount, isLoading = false }: ActiveMilestoneCardProps) {
  return (
    <div className="bg-component-background rounded-lg shadow-sm p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <span className="text-text-primary text-sm font-semibold">미완료 마일스톤</span>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          ) : (
            <span className="text-text-primary text-3xl font-bold">
              {activeMilestoneCount}
            </span>
          )}
        </div>
        <div className="bg-purple-500/20 rounded-full p-2">
          <Flag className="w-4 h-4 text-purple-500" />
        </div>
      </div>
      <p className="text-xs text-text-secondary">개</p>
    </div>
  )
}