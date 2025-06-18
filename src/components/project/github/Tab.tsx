import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch, faExclamation, faCodePullRequest, faCodeCommit, faSignal, faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { faFolder, faCircle, faBuilding } from "@fortawesome/free-regular-svg-icons";

interface TabProps {
  selectedTab: 'overview' | 'repo' | 'issue' | 'pr' | 'commit' | 'cicd' | 'org' | 'analytics';
  setSelectedTab: (tab: 'overview' | 'repo' | 'issue' | 'pr' | 'commit' | 'cicd' | 'org' | 'analytics') => void;
}

export default function Tab({ selectedTab, setSelectedTab }: TabProps) {
  const tabName = {
    overview: "개요",
    repo: "저장소",
    issue: "이슈",
    pr: "PR",
    commit: "커밋",
    cicd: "CI/CD",
    org: "조직",
    analytics: "분석",
  }

  const tabIcon = {
    overview: faFolder,
    repo: faCodeBranch,
    issue: faExclamation,
    pr: faCodePullRequest,
    commit: faCodeCommit,
    cicd: faSignal,
    org: faBuilding,
    analytics: faChartColumn,
  }

  return (
    <div className="flex items-center w-full bg-component-tertiary-background rounded-lg p-2 cursor-pointer text-xs md:text-sm">
      {Object.entries(tabName).map(([key, value]) => (
        <div
          key={key}
          onClick={() => setSelectedTab(key as 'overview' | 'repo' | 'issue' | 'pr' | 'commit' | 'cicd' | 'org' | 'analytics')}
          className={`flex items-center gap-1 w-full ${selectedTab === key ? "bg-component-background text-text-primary" : "bg-transparent text-text-secondary"} px-1.5 py-1 md:px-3 md:py-2 justify-center`}
        >
          {key === "issue" ? (
            <span className="fa-layers">
              <FontAwesomeIcon icon={faCircle} className="text-text-primary" />
              <FontAwesomeIcon icon={faExclamation} className="text-text-primary" transform="shrink-6" />
            </span>
          ) : (
            <FontAwesomeIcon icon={tabIcon[key as 'overview' | 'repo' | 'issue' | 'pr' | 'commit' | 'cicd' | 'org' | 'analytics']} size="sm" />
          )}
          <span>{value}</span>
        </div>
      ))}
    </div>
  )
}