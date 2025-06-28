import { ClipboardList } from "flowbite-react-icons/outline";

interface AvgTaskCardProps {
  avgTaskCount: number;
}

export default function AvgTaskCard({ avgTaskCount }: AvgTaskCardProps) {
  return (
    <div className="bg-component-background rounded-lg shadow-sm p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <span className="text-text-primary text-sm font-semibold">평균 작업 수</span>
          <span className="text-text-primary text-3xl font-bold">
            {avgTaskCount.toFixed(1) || 0}
          </span>
        </div>
        <div className="bg-orange-500/20 rounded-full p-2">
          <ClipboardList className="w-4 h-4 text-orange-500" />
        </div>
      </div>
      <p className="text-xs text-text-secondary">per team member</p>
    </div>
  )
}