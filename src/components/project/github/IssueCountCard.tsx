import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { faCircle, faCircleCheck } from "@fortawesome/free-regular-svg-icons"; 

interface IssueCountCardProps {
  issueLength: number;
  state: string;
}

export default function IssueCountCard({ issueLength, state }: IssueCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">{state === "open" ? "열린 이슈" : "닫힌 이슈"}</span>
        {state === "open" ? (
          <span className="fa-layers">
            <FontAwesomeIcon icon={faCircle} className="text-red-500" />
            <FontAwesomeIcon icon={faExclamation} className="text-red-500" transform="shrink-6" />
          </span>
        ) : (
          <FontAwesomeIcon icon={faCircleCheck} className="text-purple-500" />
        )}
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">
          {issueLength || 0}
        </span>
        <p className="text-xs text-text-secondary">{state === "open" ? "처리 대기 중" : "해결됨"}</p>
      </div>
    </div>
  );
}