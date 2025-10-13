import Badge from "@/components/ui/Badge";
import { Star, CodeFork, CodePullRequest, ExclamationCircle } from "flowbite-react-icons/outline";
import { getLanguageColor } from "@/utils/languageColors";
import Tooltip from "@/components/ui/Tooltip";
import Link from "next/link";
import { Ellipsis, Plus } from "lucide-react";
import Select, { SelectOption } from "@/components/ui/Select";
import { useState, useEffect, useRef } from "react";
import NewRepoConnectModal from "@/components/project/github/repo/NewRepoConnectModal";

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
  availableRepos?: SelectOption[];
  onRepoChange?: (repoValue: string) => void;
  selectedRepo?: string;
}

export default function Repo({ repoData, prCount, availableRepos = [], onRepoChange, selectedRepo }: RepoProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 저장소 옵션들 결정 (availableRepos가 있으면 사용, 없으면 기본 옵션 사용)
  const reposToShow = availableRepos.length > 0 ? availableRepos : [
    {
      name: "current",
      value: repoData?.html_url || "",
      label: `${repoData?.owner?.login || "알 수 없음"}/${repoData?.name || "현재 저장소"} (현재)`
    }
  ];

  const handleRepoChange = (repoValue: string | string[]) => {
    if (onRepoChange) {
      onRepoChange(typeof repoValue === 'string' ? repoValue : repoValue[0] || "");
    }
    setIsDropdownOpen(false); // 저장소 변경 후 드롭다운 닫기
  };

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="bg-component-background border border-component-border rounded-lg p-4">
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center justify-between w-full">
          <Link href={repoData.html_url || ""} target="_blank" className="hover:underline">
            <span className="text-xl font-bold text-text-primary">{repoData?.name || "이름 없음"}</span>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1 rounded-md hover:bg-component-secondary-background transition-colors"
            >
              <Ellipsis className="w-4 h-4 text-text-secondary hover:text-text-primary" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-component-background border border-component-border rounded-lg shadow-lg z-10">
                <div className="flex items-center justify-between p-3 border-b border-component-border">
                  <span className="text-sm font-medium text-text-primary">저장소 변경하기</span>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="p-1 rounded-md hover:bg-component-tertiary-background transition-colors"
                  >
                    <Plus className="w-4 h-4 text-text-secondary hover:text-text-primary" />
                  </button>
                </div>
                <div className="p-2">
                  <Select
                    options={reposToShow}
                    value={selectedRepo || repoData?.html_url || ""}
                    onChange={handleRepoChange}
                    placeholder="저장소를 선택하세요"
                    className="w-full"
                    dropDownClassName="w-full"
                    autoWidth
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <span className="text-sm text-text-secondary">{repoData?.description || "설명 없음"}</span>
        {repoData?.topics?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {repoData?.topics?.map((topic, index) => (
              <Badge
                key={index}
                content={topic}
                color="blue"
                className="!text-xs !font-semibold !px-2 !py-0.5 !rounded-full"
              />
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLanguageColor(repoData?.language) }}></div>
            <span className="text-sm text-text-secondary">{repoData?.language || "언어 없음"}</span>
          </div>
          <Tooltip content="Star" placement="bottom">
            <div className="group flex items-center gap-1 hover:cursor-pointer">
              <Star className="w-4 h-4 text-text-secondary group-hover:text-blue-500" />
              <span className="text-sm text-text-secondary group-hover:text-blue-500">{repoData?.stargazers_count || "0"}</span>
            </div>
          </Tooltip>
          <Tooltip content="Pull Request" placement="bottom">
            <div className="group flex items-center gap-1 hover:cursor-pointer">
              <CodePullRequest className="w-4 h-4 text-text-secondary group-hover:text-blue-500" />
              <span className="text-sm text-text-secondary group-hover:text-blue-500">{prCount || "0"}</span>
            </div>
          </Tooltip>
          <Tooltip content="Fork" placement="bottom">
            <div className="group flex items-center gap-1 hover:cursor-pointer">
              <CodeFork className="w-4 h-4 text-text-secondary group-hover:text-blue-500" />
              <span className="text-sm text-text-secondary group-hover:text-blue-500">{repoData?.forks_count || "0"}</span>
            </div>
          </Tooltip>
          <Tooltip content="Issue" placement="bottom">
            <div className="group flex items-center gap-1 hover:cursor-pointer">
              <ExclamationCircle className="w-4 h-4 text-text-secondary group-hover:text-blue-500" />
              <span className="text-sm text-text-secondary group-hover:text-blue-500">{repoData?.open_issues_count || "0"}</span>
            </div>
          </Tooltip>
        </div>
      </div>
      <NewRepoConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}