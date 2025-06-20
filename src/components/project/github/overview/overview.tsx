import { useTheme } from "@/contexts/ThemeContext";
import OrgCard from "@/components/project/github/overview/OrgCard";
import RecentActivityCard from "@/components/project/github/overview/RecentActivityCard";
import { CommitData } from "@/types/CommitData";
import { IssueData } from "@/types/IssueData";
import { PrData } from "@/types/PrData";
import { Activity } from "@/types/ActivityData";

interface OverviewProps {
  issueData: { items: IssueData[] };
  prData: PrData[];
  commitData: CommitData[];
  orgData: {
    name: string;
    login: string;
    description: string;
    public_repos: number;
    collaborators: number;
    avatar_url: string;
    html_url: string;
    company: string;
    location: string;
  };
}

const getRepoNameFromUrl = (url: string): string => {
  if (!url) return '';
  try {
    const parts = url.split('/');
    const repoIndex = parts.indexOf('repos');
    if (repoIndex !== -1 && repoIndex + 2 < parts.length) {
      return `${parts[repoIndex + 1]}/${parts[repoIndex + 2]}`;
    }
    const ownerIndex = parts.findIndex(p => p === 'github.com');
    if (ownerIndex !== -1 && ownerIndex + 2 < parts.length) {
      return `${parts[ownerIndex + 1]}/${parts[ownerIndex + 2]}`;
    }
  } catch {
    console.error("Could not parse repo name from url:", url);
  }
  return '';
};

const transformToActivities = (
  issues: IssueData[],
  prs: PrData[],
  commits: CommitData[]
): Activity[] => {
  const allActivities: Activity[] = [];

  if (issues) {
    issues.forEach(issue => {
      if (issue.pull_request) return; 
      allActivities.push({
        id: issue.id,
        type: 'issue',
        title: issue.title,
        author: issue.user.login,
        date: issue.created_at,
        url: issue.html_url,
        state: issue.state,
        repoName: getRepoNameFromUrl(issue.repository_url),
      });
    });
  }

  if (prs) {
    prs.forEach(pr => {
      let state: 'merged' | 'open' | 'closed' = 'closed';
      if (pr.merged_at) {
        state = 'merged';
      } else if (pr.state === 'open') {
        state = 'open';
      }
      allActivities.push({
        id: pr.id,
        type: 'pr',
        title: pr.title,
        author: pr.assignee?.login || 'N/A',
        date: pr.created_at,
        url: pr.html_url,
        state,
        repoName: getRepoNameFromUrl(pr.html_url),
      });
    });
  }

  if (commits) {
    commits.forEach(commitData => {
      allActivities.push({
        id: commitData.commit.tree.sha,
        type: 'commit',
        title: commitData.commit.message.split('\n')[0],
        author: commitData.commit.author.name,
        date: commitData.commit.author.date,
        url: commitData.html_url, 
        repoName: getRepoNameFromUrl(commitData.html_url),
      });
    });
  }

  return allActivities;
};

export default function Overview({ issueData, prData, commitData, orgData }: OverviewProps) {
  const { isDark } = useTheme();

  const allIssues = issueData?.items || [];
  const allPRs = prData || [];
  const allCommits = commitData || [];

  const allActivities = transformToActivities(allIssues, allPRs, allCommits);

  const recentActivities = allActivities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <OrgCard isDark={isDark} orgData={orgData} />
      <RecentActivityCard recentItems={recentActivities} />
    </div>
  );
}