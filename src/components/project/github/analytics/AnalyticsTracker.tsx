import { CommitData } from "@/types/github/CommitData";
import { RepoData } from "@/types/github/RepoData";
import LineCountCard from "@/components/project/github/commit/LineCountCard";
import TotalStarCountCard from "@/components/project/github/analytics/TotalStarCountCard";
import ForkCountCard from "@/components/project/github/analytics/ForkCountCard";
import CommitCountCard from "@/components/project/github/CommitCountCard";
import CommitChart from "@/components/project/github/analytics/CommitChart";
import LanguageChart from "@/components/project/github/analytics/LanguageChart";
import WatcherCountCard from "@/components/project/github/analytics/WatcherCountCard";
import RepoPopularityChart from "@/components/project/github/analytics/RepoPopularityChart";
import WeeklyReport from "@/components/project/github/analytics/WeeklyReport";

import { PrData } from "@/types/github/PrData";
import { IssueData } from "@/types/github/IssueData";

interface AnalyticsTrackerProps {
  commits: CommitData[];
  repoData: RepoData;
  pullRequests?: PrData[];
  issues?: IssueData[];
}

export default function AnalyticsTracker({ commits, repoData, pullRequests = [], issues = [] }: AnalyticsTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
        <CommitCountCard commitData={commits || []} />
        <LineCountCard lineCount={commits.reduce((total, commit) => total + (commit.commitDetail?.stats?.total || 0), 0)} state="total" />
        <TotalStarCountCard starCount={repoData.stargazers_count || 0} repoCount={1} />
        <ForkCountCard forkCount={repoData.forks_count || 0} />
        <WatcherCountCard watcherCount={repoData.watchers_count || 0} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <CommitChart commits={commits} />
        <LanguageChart languages={repoData.languages} />
        <RepoPopularityChart
          stars={repoData.stargazers_count || 0}
          forks={repoData.forks_count || 0}
          watchers={repoData.watchers_count || 0}
        />
      </div>
      {/* Weekly report */}
      <WeeklyReport
          commits={commits}
          repoData={repoData}
          pullRequests={pullRequests}
          issues={issues}
        />
    </div>
  );
}