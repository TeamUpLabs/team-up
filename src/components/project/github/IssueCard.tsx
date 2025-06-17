import { ExclamationCircle } from "flowbite-react-icons/outline";

interface RepoData {
  open_issues_count?: number;
}

export default function IssueCard({ repoData }: { repoData: RepoData }) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">열린 이슈</span>
        <ExclamationCircle className="w-4 h-4 text-text-primary" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">
          {repoData.open_issues_count ?? 0}
        </span>
        <p className="text-xs text-text-secondary">처리 대기 중</p>
      </div>
    </div>
  );
}