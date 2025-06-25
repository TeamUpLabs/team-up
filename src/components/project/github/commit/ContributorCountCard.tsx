import { Users } from "flowbite-react-icons/outline";

interface ContributorCountCardProps {
  contributorCount: number;
}

export default function ContributorCountCard({ contributorCount }: ContributorCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">총 기여자</span>
        <Users className="text-text-primary" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">
          {contributorCount || 0}
        </span>
        <p className="text-xs text-text-secondary">명</p>
      </div>
    </div>
  );
}