import { PrData } from "@/types/PrData";
import PRCountCard from "@/components/project/github/PRCountCard";
import PRAverageResolutionTimeCard from "@/components/project/github/pr/PRAverageResolutionTimeCard";

interface PRTrackerProps {
  prData: PrData[];
}

export default function PRTracker({ prData }: PRTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <PRCountCard prCount={prData.filter((pr) => pr.state === "open").length || 0} state="open" />
        <PRCountCard prCount={prData.filter((pr) => pr.state === "closed").length || 0} state="closed" />
        <PRAverageResolutionTimeCard prs={prData} />
      </div>
    </div>
  );
}