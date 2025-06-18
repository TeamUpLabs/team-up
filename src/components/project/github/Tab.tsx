import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch, faExclamation, faCodePullRequest, faCodeCommit, faSignal, faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { faFolder, faCircle, faBuilding } from "@fortawesome/free-regular-svg-icons";

interface TabProps {
  selectedTab: 'overview' | 'repo' | 'issue' | 'pr' | 'commit' | 'cicd' | 'org' | 'analytics';
  setSelectedTab: (tab: 'overview' | 'repo' | 'issue' | 'pr' | 'commit' | 'cicd' | 'org' | 'analytics') => void;
}

export default function Tab({ selectedTab, setSelectedTab }: TabProps) {
  return (
    <div className="flex items-center w-full bg-component-tertiary-background rounded-lg p-2 cursor-pointer text-sm">
      <div
        onClick={() => setSelectedTab("overview")}
        className={`flex items-center gap-1 w-full ${selectedTab === "overview" ? "bg-component-background text-text-primary" : "bg-transparent text-text-secondary"} px-3 py-2 justify-center`}
      >
        <FontAwesomeIcon icon={faFolder} size="sm" />
        <span>개요</span>
      </div>
      <div
        onClick={() => setSelectedTab("repo")}
        className={`flex items-center gap-1 w-full ${selectedTab === "repo" ? "bg-component-background text-text-primary" : "bg-transparent text-text-secondary"} px-3 py-2 justify-center`}
      >
        <FontAwesomeIcon icon={faCodeBranch} size="sm" />
        <span>저장소</span>
      </div>
      <div
        onClick={() => setSelectedTab("issue")}
        className={`flex items-center gap-1 w-full ${selectedTab === "issue" ? "bg-component-background text-text-primary" : "bg-transparent text-text-secondary"} px-3 py-2 justify-center`}
      >
        <span className="fa-layers">
          <FontAwesomeIcon icon={faCircle} className="text-text-primary" />
          <FontAwesomeIcon icon={faExclamation} className="text-text-primary" transform="shrink-6" />
        </span>
        <span>이슈</span>
      </div>
      <div
        onClick={() => setSelectedTab("pr")}
        className={`flex items-center gap-1 w-full ${selectedTab === "pr" ? "bg-component-background text-text-primary" : "bg-transparent text-text-secondary"} px-3 py-2 justify-center`}
      >
        <FontAwesomeIcon icon={faCodePullRequest} size="sm" />
        <span>PR</span>
      </div>
      <div
        onClick={() => setSelectedTab("commit")}
        className={`flex items-center gap-1 w-full ${selectedTab === "commit" ? "bg-component-background text-text-primary" : "bg-transparent text-text-secondary"} px-3 py-2 justify-center`}
      >
        <FontAwesomeIcon icon={faCodeCommit} size="sm" />
        <span>커밋</span>
      </div>
      <div
        onClick={() => setSelectedTab("cicd")}
        className={`flex items-center gap-1 w-full ${selectedTab === "cicd" ? "bg-component-background text-text-primary" : "bg-transparent text-text-secondary"} px-3 py-2 justify-center`}
      >
        <FontAwesomeIcon icon={faSignal} size="sm" />
        <span>CI/CD</span>
      </div>
      <div
        onClick={() => setSelectedTab("org")}
        className={`flex items-center gap-1 w-full ${selectedTab === "org" ? "bg-component-background text-text-primary" : "bg-transparent text-text-secondary"} px-3 py-2 justify-center`}
      >
        <FontAwesomeIcon icon={faBuilding} size="sm" />
        <span> 조직</span>
      </div>
      <div
        onClick={() => setSelectedTab("analytics")}
        className={`flex items-center gap-1 w-full ${selectedTab === "analytics" ? "bg-component-background text-text-primary" : "bg-transparent text-text-secondary"} px-3 py-2 justify-center`}
      >
        <FontAwesomeIcon icon={faChartColumn} size="sm" />
        <span>분석</span>
      </div>
    </div>
  )
}