"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons";

const formatCommitDate = (dateString: string): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);  // 날짜 보정

  const today = new Date();
  const yesterday = new Date(today);
  const dayBeforeYesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

  // Set hours to 0 to compare dates without time
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const compareToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const compareYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  const compareDayBeforeYesterday = new Date(dayBeforeYesterday.getFullYear(), dayBeforeYesterday.getMonth(), dayBeforeYesterday.getDate());

  console.log(compareDate, compareToday);
  if (compareDate.getTime() === compareToday.getTime()) {
    return '오늘';
  } else if (compareDate.getTime() === compareYesterday.getTime()) {
    return '어제';
  } else if (compareDate.getTime() === compareDayBeforeYesterday.getTime()) {
    return '그저께';
  } else {
    // Format as YYYY-MM-DD
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '-').replace(/\./g, '');
  }
};

export interface CommitData {
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
  }
}

interface CommitCardProps {
  commitData: CommitData[] | null;
}

export default function CommitCard({ commitData }: CommitCardProps) {
  // Handle loading state or empty data
  const hasCommits = commitData && commitData.length > 0;
  
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">최근 커밋</span>
        <FontAwesomeIcon icon={faCodeCommit} className="w-4 h-4 text-text-primary" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">
          {hasCommits ? commitData.length : 0}
        </span>
        <p className="text-xs text-text-secondary">
          {hasCommits 
            ? formatCommitDate(commitData[0].commit.author.date)
            : '커밋 없음'}
        </p>
      </div>
    </div>
  );
}