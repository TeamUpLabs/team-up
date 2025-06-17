import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

interface RepoData {
  open_issues_count?: number;
}

export default function IssueCard({ repoData }: { repoData: RepoData }) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">열린 이슈</span>
        <span className="fa-layers">
          <FontAwesomeIcon icon={faCircle} className="text-text-primary" />
          <FontAwesomeIcon icon={faExclamation} className="text-text-primary" transform="shrink-6" />
        </span>
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