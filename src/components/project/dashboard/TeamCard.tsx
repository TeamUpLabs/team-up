import { Users } from "flowbite-react-icons/solid";

interface ActiveTaskCardProps {
  TotalMemberCount: number;
  ActiveMemberCount: number;
  isLoading?: boolean;
}

export default function ActiveTaskCard({ TotalMemberCount, ActiveMemberCount, isLoading = false }: ActiveTaskCardProps) {
  return (
    <div className="bg-component-background rounded-lg shadow-sm p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <span className="text-text-primary text-sm font-semibold">팀원</span>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          ) : (
            <span className="text-text-primary text-3xl font-bold">
              {TotalMemberCount}
            </span>
          )}
        </div>
        <div className="bg-green-500/20 rounded-full p-2">
          <Users className="w-4 h-4 text-green-500" />
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-text-secondary">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
        {isLoading ? (
          <div className="h-4 bg-gray-200 rounded w-3 animate-pulse"></div>
        ) : (
          <span className="text-text-primary">
            {ActiveMemberCount}
          </span>
        )}
        online now
      </div>
    </div>
  )
}