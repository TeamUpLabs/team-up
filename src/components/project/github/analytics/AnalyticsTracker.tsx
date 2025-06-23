import { CommitData } from "@/types/CommitData";
import { RepoData } from "@/types/RepoData";
import LineCountCard from "@/components/project/github/commit/LineCountCard";
import TotalStarCountCard from "@/components/project/github/analytics/TotalStarCountCard";
import ForkCountCard from "@/components/project/github/analytics/ForkCountCard";
import CommitCountCard from "@/components/project/github/CommitCountCard";

interface AnalyticsTrackerProps {
  commits: CommitData[];
  repoData: RepoData;
}

export default function AnalyticsTracker({ commits, repoData }: AnalyticsTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <CommitCountCard commitData={commits || []} />
        <LineCountCard lineCount={commits.reduce((total, commit) => total + (commit.commitDetail?.stats?.total || 0), 0)} state="total" />
        <TotalStarCountCard starCount={repoData.stargazers_count || 0} repoCount={1} />
        <ForkCountCard forkCount={repoData.forks_count || 0} />
      </div>
    </div>
  );
}