import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { PrData } from "@/types/github/PrData";

interface PRAverageResolutionTimeCardProps {
  prs: PrData[];
}

const calculateAverageResolutionTime = (prs: PrData[]) => {
  const closedPrs = prs.filter((pr) => pr.state === "closed" && pr.closed_at);
  if (closedPrs.length === 0) {
    return "N/A";
  }

  const totalResolutionTime = closedPrs.reduce((total, pr) => {
    const createdAt = new Date(pr.created_at).getTime();
    const closedAt = new Date(pr.closed_at!).getTime();
    return total + (closedAt - createdAt);
  }, 0);

  const averageTimeInMs = totalResolutionTime / closedPrs.length;
  const averageDays = averageTimeInMs / (1000 * 60 * 60 * 24);

  return `${averageDays.toFixed(1)}일`;
};

export default function PRAverageResolutionTimeCard({ prs }: PRAverageResolutionTimeCardProps) {
  const averageTime = calculateAverageResolutionTime(prs);

  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">평균 해결 시간</span>
        <FontAwesomeIcon icon={faClock} className="text-blue-500" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">{averageTime || "N/A"}</span>
        <p className="text-xs text-text-secondary">PR이 해결되기까지의 평균 시간</p>
      </div>
    </div>
  );
}
