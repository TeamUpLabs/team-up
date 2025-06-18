import { useTheme } from "@/contexts/ThemeContext";
import OrgCard from "@/components/project/github/overview/OrgCard";
import RecentActivityCard from "@/components/project/github/overview/RecentActivityCard";

interface CommitAuthor {
  date?: string;
  name?: string;
  email?: string;
}

interface Commit {
  author?: CommitAuthor;
  message?: string;
}

export interface GitHubItem {
  __type?: 'issue' | 'pr' | 'commit';
  created_at?: string;
  updated_at?: string;
  title?: string;
  state?: 'open' | 'closed';
  merged?: boolean;
  repository_url?: string;
  commit?: Commit & {
    message?: string;
    author?: {
      date?: string;
      name?: string;
      email?: string;
    };
  };
  author?: {
    login?: string;
    avatar_url?: string;
  };
  html_url?: string;
}

interface GitHubResponse<T> {
  total_count?: number;
  items?: T[];
}

interface OverviewProps {
  issueData: GitHubResponse<GitHubItem> | GitHubItem[];
  prData: GitHubResponse<GitHubItem> | GitHubItem[];
  commitData: GitHubResponse<GitHubItem> | GitHubItem[];
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

const getItems = (data: GitHubResponse<GitHubItem> | GitHubItem[]): GitHubItem[] => {
  if (Array.isArray(data)) {
    return data;
  }
  return data?.items || [];
};

const getDate = (item: GitHubItem): Date => {
  const dateStr = item.created_at || item.updated_at || item.commit?.author?.date;
  return dateStr ? new Date(dateStr) : new Date(0);
};

export default function Overview({ issueData = [], prData = [], commitData = [], orgData }: OverviewProps) {
  const { isDark } = useTheme();

  // Get all items from each category
  const allIssues = getItems(issueData);
  const allPRs = getItems(prData);
  const allCommits = getItems(commitData);

  // Combine all items with their type
  const allItems = [
    ...allIssues.map(item => ({ ...item, __type: 'issue' as const })),
    ...allPRs.map(item => ({ ...item, __type: 'pr' as const })),
    ...allCommits.map(item => ({ ...item, __type: 'commit' as const }))
  ];

  // Sort all items by date (newest first) and take top 3
  const recentItems = [...allItems]
    .sort((a, b) => getDate(b).getTime() - getDate(a).getTime())
    .slice(0, 3);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <OrgCard isDark={isDark} orgData={orgData} />
      <RecentActivityCard recentItems={recentItems} />
    </div>
  );
}