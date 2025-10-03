import { Shield } from "lucide-react";
import { convertJobName } from "@/utils/ConvertJobName";

interface DepartmentCardProps {
  departments: string[];
}

export default function DepartmentCard({ departments }: DepartmentCardProps) {
  return (
    <div className="bg-component-background rounded-lg shadow-sm p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <span className="text-text-primary text-sm font-semibold">부서</span>
          <span className="text-text-primary text-3xl font-bold">
            {departments.length || 0}
          </span>
        </div>
        <div className="bg-purple-500/20 rounded-full p-2">
          <Shield className="w-4 h-4 text-purple-500" />
        </div>
      </div>
      <p className="text-xs text-text-secondary">{departments.map(department => convertJobName(department)).join(', ')}</p>
    </div>
  )
}