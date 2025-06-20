import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { IssueData } from "@/types/IssueData";

interface IssueAverageResolutionTimeCardProps {
  issues: IssueData[];
}

const calculateAverageResolutionTime = (issues: IssueData[]) => {
  const closedIssues = issues.filter((issue) => issue.state === "closed" && issue.closed_at);
  if (closedIssues.length === 0) {
    return "N/A";
  }

  const totalResolutionTime = closedIssues.reduce((total, issue) => {
    const createdAt = new Date(issue.created_at).getTime();
    const closedAt = new Date(issue.closed_at!).getTime();
    return total + (closedAt - createdAt);
  }, 0);

  const averageTimeInMs = totalResolutionTime / closedIssues.length;
  const averageDays = averageTimeInMs / (1000 * 60 * 60 * 24);

  return `${averageDays.toFixed(1)}일`;
};

export default function IssueAverageResolutionTimeCard({ issues }: IssueAverageResolutionTimeCardProps) {
  const averageTime = calculateAverageResolutionTime(issues);

  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">평균 해결 시간</span>
        <FontAwesomeIcon icon={faClock} className="text-blue-500" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">{averageTime}</span>
        <p className="text-xs text-text-secondary">이슈가 해결되기까지의 평균 시간</p>
      </div>
    </div>
  );
}
