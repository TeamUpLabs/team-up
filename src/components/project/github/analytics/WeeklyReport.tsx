import { CommitData } from "@/types/github/CommitData";
import { RepoData } from "@/types/github/RepoData";
import { PrData } from "@/types/github/PrData";
import { IssueData } from "@/types/github/IssueData";
import { Award, CalendarWeek, Clock, CodeBranch } from "flowbite-react-icons/outline";
import { useTheme } from "@/contexts/ThemeContext";

interface WeeklyReportProps {
  commits: CommitData[];
  repoData: RepoData;
  pullRequests?: PrData[];
  issues?: IssueData[];
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
  });
}

export default function WeeklyReport({ commits, repoData, pullRequests = [], issues = [] }: WeeklyReportProps) {  const last7Days = getLast7Days();
  const { isDark } = useTheme();
  
  const weeklyCommits = commits.filter((commit) => {
    const date = new Date(commit.commit.author.date).toISOString().split("T")[0];
    return last7Days.includes(date);
  });

  const totalCommits = weeklyCommits.length;
  const totalAdditions = weeklyCommits.reduce(
    (sum, c) => sum + (c.commitDetail?.stats?.additions || 0),
    0
  );
  const totalDeletions = weeklyCommits.reduce(
    (sum, c) => sum + (c.commitDetail?.stats?.deletions || 0),
    0
  );

  // Commits per day
  const commitsPerDay = last7Days.reduce<Record<string, number>>((acc, day) => {
    acc[day] = 0;
    return acc;
  }, {});
  weeklyCommits.forEach((c) => {
    const day = new Date(c.commit.author.date).toISOString().split("T")[0];
    commitsPerDay[day] = (commitsPerDay[day] || 0) + 1;
  });

  const mostActiveDay = Object.entries(commitsPerDay).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  const averageCommitsPerDayNum = totalCommits / 7;
  const averageCommitsPerDay = averageCommitsPerDayNum.toFixed(0);
  const additionRatio = ((totalAdditions / (totalAdditions + totalDeletions || 1)) * 100).toFixed(0);

  // PR & Issue metrics last 7 days
  const prOpened = pullRequests.filter(pr => last7Days.includes(pr.created_at.split('T')[0])).length;
  const prMerged = pullRequests.filter(pr => pr.merged_at && last7Days.includes(pr.merged_at.split('T')[0])).length;
  const issueOpened = issues.filter(is => last7Days.includes(is.created_at.split('T')[0])).length;
  const issueClosed = issues.filter(is => is.closed_at && last7Days.includes(is.closed_at.split('T')[0])).length;

  // TypeScript usage percentage
  const totalLangBytes = Object.values(repoData.languages || {}).reduce((s, v) => s + v, 0);
  const tsBytes = repoData.languages?.TypeScript || repoData.languages?.typescript || 0;
  const tsUsage = totalLangBytes ? ((tsBytes / totalLangBytes) * 100).toFixed(0) : null;

  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border hover:border-point-color-indigo-hover transition duration-200 ease-in-out space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-text-primary text-xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6" /> 주간 개발 활동 보고서
        </p>
        <span className="text-text-secondary text-sm">
          {new Date(last7Days[last7Days.length - 1]).toLocaleDateString("ko-KR")} - {new Date(last7Days[0]).toLocaleDateString("ko-KR")}
        </span>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {/* Avg commits */}
        <div className={`rounded-lg p-4 ${isDark ? "bg-indigo-900 text-indigo-200" : "bg-indigo-100 text-indigo-800"} text-center`}>
          <p className="text-indigo-600 text-2xl font-bold">{averageCommitsPerDay}</p>
          <span className="text-text-secondary text-xs">일평균 커밋</span>
        </div>
        {/* Addition ratio */}
        <div className={`rounded-lg p-4 ${isDark ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"} text-center`}>
          <p className="text-green-600 text-2xl font-bold">{additionRatio}%</p>
          <span className="text-text-secondary text-xs">코드 추가 비율</span>
        </div>
        {/* Total stars */}
        <div className={`rounded-lg p-4 ${isDark ? "bg-violet-900 text-violet-200" : "bg-violet-100 text-violet-800"} text-center`}>
          <p className="text-violet-600 text-2xl font-bold">{repoData.stargazers_count || 0}</p>
          <span className="text-text-secondary text-xs">총 스타 수</span>
        </div>
        {/* Active repos */}
        <div className={`rounded-lg p-4 ${isDark ? "bg-orange-900 text-orange-200" : "bg-orange-100 text-orange-800"} text-center`}>
          <p className="text-orange-600 text-2xl font-bold">1</p>
          <span className="text-text-secondary text-xs">활성 저장소</span>
        </div>
      </div>

      {/* Details list */}
      <div className="space-y-2 text-sm">
        <p className="flex items-center gap-2 text-text-secondary">
          <CalendarWeek className="w-5 h-5" /> 가장 활발한 날: <span className="text-text-primary font-semibold">{new Date(mostActiveDay).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</span>
        </p>
        <p className="flex items-center gap-2 text-text-secondary">
          <CodeBranch className="w-5 h-5" /> 가장 활발한 저장소: <span className="text-text-primary font-semibold">{repoData.name}</span>
        </p>
        <p className="flex items-center gap-2 text-text-secondary">
          <Clock className="w-5 h-5" /> 총 작업 시간 (추정): <span className="text-text-primary font-semibold">{Math.round(totalCommits * 0.5)}시간</span>
        </p>
      </div>

      {/* Highlights */}
      <div className="bg-component-secondary-background rounded-lg p-4">
        <p className="text-text-primary font-semibold mb-2">이번 주 하이라이트</p>
        <ul className="list-disc list-inside text-text-secondary space-y-1 text-sm">
          <li>{totalCommits}개의 커밋</li>
          <li>{totalAdditions}줄 추가 / {totalDeletions}줄 삭제</li>
          <li>{prOpened}개의 PR 생성 · {prMerged}개 병합</li>
          <li>{issueOpened}개의 이슈 생성 · {issueClosed}개 닫힘</li>
          {tsUsage !== null && <li>TypeScript 사용률 {tsUsage}%</li>}
        </ul>
      </div>
    </div>
  );
}
