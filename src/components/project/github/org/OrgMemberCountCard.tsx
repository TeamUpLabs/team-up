import { Users } from "flowbite-react-icons/outline";

interface OrgMemberCountCardProps {
  memberCount: number;
}

export default function OrgMemberCountCard({ memberCount }: OrgMemberCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">총 멤버</span>
        <Users className="text-text-primary" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">
          {memberCount || 0}
        </span>
        <p className="text-xs text-text-secondary">공개 멤버</p>
      </div>
    </div>
  );
}