import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodePullRequest, faCodeMerge } from "@fortawesome/free-solid-svg-icons";

interface PRCountCardProps {
  prCount?: number;
  state: string;
}

export default function PRCountCard({ prCount, state }: PRCountCardProps) {

  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">{state === "open" ? "열린 PR" : "병합된 PR"}</span>
        {state === "open" ? (
          <FontAwesomeIcon icon={faCodePullRequest} className="w-4 h-4 text-green-500" />
        ) : (
          <FontAwesomeIcon icon={faCodeMerge} className="w-4 h-4 text-purple-500" />
        )}
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">
          {prCount || 0}
        </span>
        <p className="text-xs text-text-secondary">{state === "open" ? "리뷰 대기 중" : "병합됨"}</p>
      </div>
    </div>
  );
}