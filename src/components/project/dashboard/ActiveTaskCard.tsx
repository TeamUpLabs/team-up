import { ClipboardList } from "flowbite-react-icons/solid";

interface ActiveTaskCardProps {
  activeTaskCount: number;
  isLoading?: boolean;
}

export default function ActiveTaskCard({ activeTaskCount, isLoading = false }: ActiveTaskCardProps) {
  return (
    <div className="bg-component-background rounded-lg shadow-sm p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <span className="text-text-primary text-sm font-semibold">미완료 작업</span>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          ) : (
            <span className="text-text-primary text-3xl font-bold">
              {activeTaskCount}
            </span>
          )}
        </div>
        <div className="bg-orange-500/20 rounded-full p-2">
          <ClipboardList className="w-4 h-4 text-orange-500" />
        </div>
      </div>
      <p className="text-xs text-text-secondary">개</p>
    </div>
  )
}