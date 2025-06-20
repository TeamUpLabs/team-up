"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";
import { CommitData } from "@/types/CommitData";

interface CommitCardProps {
  commitData: CommitData[] | null;
}

export default function CommitCountCard({ commitData }: CommitCardProps) {
  // Handle loading state or empty data
  const hasCommits = commitData && commitData.length > 0;
  
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">최근 커밋</span>
        <FontAwesomeIcon icon={faCodeCommit} className="w-4 h-4 text-blue-500" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">
          {hasCommits ? commitData.length : 0}
        </span>
        <p className="text-xs text-text-secondary">
          {hasCommits 
            ? formatDate(new Date(commitData[0].commit.author.date))
            : '커밋 없음'}
        </p>
      </div>
    </div>
  );
}