import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodePullRequest } from "@fortawesome/free-solid-svg-icons";

interface PRData {
  total_count?: number;
}

export default function PRCountCard({ prData }: { prData: PRData }) {

  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">열린 PR</span>
        <FontAwesomeIcon icon={faCodePullRequest} className="w-4 h-4 text-text-primary" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">
          {prData.total_count ?? 0}
        </span>
        <p className="text-xs text-text-secondary">리뷰 대기 중</p>
      </div>
    </div>
  );
}