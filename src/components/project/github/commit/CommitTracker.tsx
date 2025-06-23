import { CommitData } from "@/types/CommitData";
import CommitCountCard from "@/components/project/github/CommitCountCard";
import ContributorCountCard from "@/components/project/github/commit/ContributorCountCard";
import LineCountCard from "@/components/project/github/commit/LineCountCard";
import ChangedFileCountCard from "@/components/project/github/commit/ChangedFileCountCard";

interface CommitTrackerProps {
  commits: CommitData[];
}

export default function CommitTracker({ commits }: CommitTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
        <CommitCountCard commitData={commits} />
        <LineCountCard
          lineCount={commits.reduce((total, commit) => total + (commit.commitDetail?.stats?.additions || 0), 0)}
          state="additions"
        />
        <LineCountCard
          lineCount={commits.reduce((total, commit) => total + (commit.commitDetail?.stats?.deletions || 0), 0)}
          state="deletions"
        />
        <ChangedFileCountCard changedFileCount={commits.reduce((total, commit) => total + (commit.commitDetail?.files.length || 0), 0)} />
        <ContributorCountCard contributorCount={new Set(commits.map(commit => commit.author?.login).filter(Boolean)).size} />
      </div>
    </div>
  );
}