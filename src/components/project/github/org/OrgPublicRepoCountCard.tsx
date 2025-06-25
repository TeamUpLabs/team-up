import { CodeBranch } from "flowbite-react-icons/outline";

interface OrgPublicRepoCountCardProps {
  publicRepoCount: number;
}

export default function OrgPublicRepoCountCard({ publicRepoCount }: OrgPublicRepoCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">조직 저장소</span>
        <CodeBranch className="text-cyan-600" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">
          {publicRepoCount || 0}
        </span>
        <p className="text-xs text-text-secondary">공개 저장소</p>
      </div>
    </div>
  );
}