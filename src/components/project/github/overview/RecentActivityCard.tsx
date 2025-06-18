import { formatDate } from "@/utils/formatDate";
import Badge, { BadgeColor } from "@/components/ui/Badge";
import Link from "next/link";
import { faCodeCommit, faCodePullRequest, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GitHubItem } from "@/components/project/github/overview/overview";

type TypedGitHubItem = GitHubItem & {
  __type: 'issue' | 'pr' | 'commit';
  html_url?: string;
};

interface RecentActivityCardProps {
  recentItems: TypedGitHubItem[];
}

const getDate = (item: TypedGitHubItem): Date => {
  const dateStr = item.created_at || item.updated_at || item.commit?.author?.date;
  return dateStr ? new Date(dateStr) : new Date(0);
};

const getTypeInfo = (type: string, item: TypedGitHubItem) => {
  switch (type) {
    case 'issue':
      return {
        icon: (
          <span className="fa-layers">
            <FontAwesomeIcon icon={faCircle} className={`text-${item.state === 'open' ? 'green-500' : 'purple-500'}`} />
            <FontAwesomeIcon icon={faExclamation} className={`text-${item.state === 'open' ? 'green-500' : 'purple-500'}`} transform="shrink-6" />
          </span>
        ),
        label: item.state === 'open' ? 'Open' : 'Closed',
        color: item.state === 'open' ? 'green' : 'purple',
      };
    case 'pr': {
      const isMerged = item.merged;
      const isOpen = item.state === 'open';
      return {
        icon: (
          <FontAwesomeIcon icon={faCodePullRequest} className={`text-${item.state === 'open' ? 'green-500' : 'red-500'}`} />
        ),
        label: isMerged ? 'Merged' : isOpen ? 'Open' : 'Closed',
        color: isMerged ? 'green' : isOpen ? 'green' : 'red',
      };
    }
    case 'commit':
      return {
        icon: (
          <FontAwesomeIcon icon={faCodeCommit} className="text-blue-500" />
        ),
        label: 'Commit',
        color: 'blue',
      };
    default:
      return {
        icon: null,
        label: '',
        color: 'gray',
      };
  }
};

export default function RecentActivityCard({ recentItems }: RecentActivityCardProps) {
  const renderItem = (item: GitHubItem & { __type: 'issue' | 'pr' | 'commit' }, index: number) => {
    const date = getDate(item);
    const title = item.title || item.commit?.message?.split('\n')[0] || 'No title';
    const repoName = item.repository_url ? item.repository_url.split('/').slice(-2).join('/') : '';
    const htmlUrl = item.html_url ? item.html_url.split('/').slice(-4, -2).join('/') : '';
    const { icon, label, color } = getTypeInfo(item.__type || 'commit', item);

    return (
      <Link href={item.html_url || ''} target="_blank" key={`${item.__type}-${index}`} className="flex items-start gap-1 px-2 py-3 hover:bg-component-secondary-background">
        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-text-secondary truncate max-w-[180px]">
              {repoName || htmlUrl}
            </span>
            <span className="text-xs text-text-secondary whitespace-nowrap ml-2">
              {formatDate(date)}
            </span>
          </div>
          <h3 className="text-sm font-medium text-text-primary mt-0.5 truncate">
            {title}
          </h3>
          <div className="flex items-center mt-1">
            <Badge
              content={label}
              color={color as BadgeColor}
              className="!text-xs !px-2 !py-0.5 !rounded-full"
            />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="bg-component-background border border-component-border rounded-lg p-4 space-y-2">
      <div className="flex flex-col gap-1">
        <span className="text-xl font-bold text-text-primary">최근 활동</span>
        <span className="text-sm text-text-secondary">GitHub에서의 최근 활동 요약</span>
      </div>
      {recentItems.length > 0 ? (
        <div className="divide-y divide-component-border">
          {recentItems.map((item, index) => renderItem(item, index))}
        </div>
      ) : (
        <span className="text-sm text-text-secondary">No activities found</span>
      )}
    </div>
  );
}