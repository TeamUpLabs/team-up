import { Star } from "flowbite-react-icons/outline";

interface TotalStarCountCardProps {
  starCount: number;
  repoCount: number;
}

export default function TotalStarCountCard({ starCount, repoCount }: TotalStarCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">총 스타</span>
        <Star className="text-yellow-500" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">{starCount || 0}</span>
        <p className="text-xs text-text-secondary">{repoCount || 0}개 저장소</p>
      </div>
    </div>
  );
}