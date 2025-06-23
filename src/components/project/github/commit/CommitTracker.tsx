import { CommitData } from "@/types/CommitData";
import ContributorCountCard from "@/components/project/github/commit/ContributorCountCard";
import LineCountCard from "@/components/project/github/commit/LineCountCard";

interface CommitTrackerProps {
  commits: CommitData[];
}

export default function CommitTracker({ commits }: CommitTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <ContributorCountCard contributorCount={new Set(commits.map(commit => commit.author?.login).filter(Boolean)).size} />
        <LineCountCard
          lineCount={commits.reduce((total, commit) => total + (commit.commitDetail?.stats?.additions || 0), 0)}
          state="additions"
        />
        <LineCountCard
          lineCount={commits.reduce((total, commit) => total + (commit.commitDetail?.stats?.deletions || 0), 0)}
          state="deletions"
        />
      </div>
    </div>
  );
}