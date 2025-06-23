import Badge from "@/components/ui/Badge";
import { Star, CodeFork, CodePullRequest, ExclamationCircle } from "flowbite-react-icons/outline";
import { getLanguageColor } from "@/utils/languageColors";
import Tooltip from "@/components/ui/Tooltip";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

interface RepoData {
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: {
    name: string;
  };
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
  language: string;
}

interface RepoProps {
  repoData: RepoData;
  prCount: number;
}

export default function Repo({ repoData, prCount }: RepoProps) {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center justify-between bg-component-background border border-component-border rounded-lg p-4">
      <div className="flex flex-col items-start gap-2">
        <Link href={repoData.html_url || ""} target="_blank" className="hover:underline">
          <span className="text-xl font-bold text-text-primary">{repoData?.name}</span>
        </Link>
        <span className="text-sm text-text-secondary">{repoData?.description}</span>
        {repoData?.topics?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {repoData?.topics?.map((topic, index) => (
              <Badge
                key={index}
                content={topic}
                color="blue"
                className="!text-xs !font-semibold !px-2 !py-0.5 !rounded-full"
                isDark={isDark}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLanguageColor(repoData?.language) }}></div>
            <span className="text-sm text-text-secondary">{repoData?.language}</span>
          </div>
          <Tooltip content="Star" placement="bottom">
            <div className="group flex items-center gap-1 hover:cursor-pointer">
              <Star className="w-4 h-4 text-text-secondary group-hover:text-blue-500" />
              <span className="text-sm text-text-secondary group-hover:text-blue-500">{repoData?.stargazers_count}</span>
            </div>
          </Tooltip>
          <Tooltip content="Pull Request" placement="bottom">
            <div className="group flex items-center gap-1 hover:cursor-pointer">
              <CodePullRequest className="w-4 h-4 text-text-secondary group-hover:text-blue-500" />
              <span className="text-sm text-text-secondary group-hover:text-blue-500">{prCount}</span>
            </div>
          </Tooltip>
          <Tooltip content="Fork" placement="bottom">
            <div className="group flex items-center gap-1 hover:cursor-pointer">
              <CodeFork className="w-4 h-4 text-text-secondary group-hover:text-blue-500" />
              <span className="text-sm text-text-secondary group-hover:text-blue-500">{repoData?.forks_count}</span>
            </div>
          </Tooltip>
          <Tooltip content="Issue" placement="bottom">
            <div className="group flex items-center gap-1 hover:cursor-pointer">
              <ExclamationCircle className="w-4 h-4 text-text-secondary group-hover:text-blue-500" />
              <span className="text-sm text-text-secondary group-hover:text-blue-500">{repoData?.open_issues_count}</span>
            </div>
          </Tooltip>
        </div>
      </div>
      <button
        type="button"
        className="flex shrink-0 hover:cursor-pointer active:scale-95"
      >
        <Badge
          content="웹훅 연결하기"
          color="black"
          className="!px-4 !py-2 !font-semibold"
        />
      </button>
    </div>
  )
}