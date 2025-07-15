"use client";

import { useState, Suspense, lazy } from "react";
import { useProject } from "@/contexts/ProjectContext";
import GithubRepoCreate from "@/layouts/GithubRepoCreate";
import { useAuthStore } from "@/auth/authStore";
import RepoCard from "@/components/project/github/RepoCard";
import IssueCountCard from "@/components/project/github/IssueCountCard";
import PRCountCard from "@/components/project/github/PRCountCard";
import CommitCountCard from "@/components/project/github/CommitCountCard";
import ProfileCard from "@/components/project/github/ProfileCard";
import Tab from "@/components/project/github/Tab";
import { useRepoData, useCommitData, usePrData, useIssueData, useUserData, useOrgData } from "@/hooks/github/getData";
import { User } from "@/types/User";
import { IssueData } from "@/types/github/IssueData";
import { PrData } from "@/types/github/PrData";
// 지연 로딩을 위한 컴포넌트들
const Overview = lazy(() => import("@/components/project/github/overview/overview"));
const Repo = lazy(() => import("@/components/project/github/repo/repo"));
const IssueTracker = lazy(() => import("@/components/project/github/issue/IssueTracker"));
const PRTracker = lazy(() => import("@/components/project/github/pr/PRTracker"));
const CommitTracker = lazy(() => import("@/components/project/github/commit/CommitTracker"));
const OrgTracker = lazy(() => import("@/components/project/github/org/OrgTracker"));
const AnalyticsTracker = lazy(() => import("@/components/project/github/analytics/AnalyticsTracker"));

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
  </div>
);

export default function GithubPage() {
  const { project } = useProject();
  const user = useAuthStore.getState().user;
  const [selectedTab, setSelectedTab] = useState<
    | "overview"
    | "repo"
    | "issue"
    | "pr"
    | "commit"
    | "org"
    | "analytics"
  >("overview");
  
  const org = "TeamUpLabs";
  const repo = project?.github_url?.split("/").pop() || "";

  // SWR 훅을 사용한 데이터 페칭
  const { data: repoData, error: repoError, isLoading: repoLoading } = useRepoData(org, repo, user as User);
  const { data: commitData, error: commitError, isLoading: commitLoading } = useCommitData(org, repo, user as User);
  const { data: prData, error: prError, isLoading: prLoading } = usePrData(org, repo, user as User);
  const { data: issueData, error: issueError, isLoading: issueLoading } = useIssueData(org, repo, user as User);
  const { data: githubUser, error: userError, isLoading: userLoading } = useUserData(user as User);
  const { data: orgData, error: orgError, isLoading: orgLoading } = useOrgData(org, user as User);

  // 전체 로딩 상태
  const isLoading = repoLoading || commitLoading || prLoading || issueLoading || userLoading || orgLoading;
  const hasError = repoError || commitError || prError || issueError || userError || orgError;

  // 안전한 기본값
  const emptyOrgData = {
    name: "",
    login: "",
    description: "",
    public_repos: 0,
    collaborators: 0,
    avatar_url: "",
    html_url: "",
    company: "",
    location: "",
    repos_url: "",
    members: [],
    repos: [],
    created_at: "",
  };

  const emptyRepoData = {
    name: "",
    html_url: "",
    description: "",
    stargazers_count: 0,
    watchers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    license: { name: "" },
    owner: { login: "", avatar_url: "" },
    topics: [],
    language: "",
    languages: {},
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-xl font-semibold text-text-primary">
          프로젝트를 불러오는 중입니다. 잠시만 기다려주세요...
        </p>
      </div>
    );
  }

  if (!project?.github_url) {
    return <GithubRepoCreate />;
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <p className="text-xl font-semibold text-red-500">
          GitHub 데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center p-4">
      <div className="w-full space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <RepoCard repoData={repoData || emptyRepoData} />
            <IssueCountCard 
              issueLength={(issueData || []).filter((issue: IssueData) => issue.state === "open").length || 0} 
              state="open" 
            />
            <PRCountCard 
              prCount={(prData || []).filter((pr: PrData) => pr.state === "open").length || 0} 
              state="open" 
            />
            <CommitCountCard commitData={commitData || []} />
          </div>
        )}

        <ProfileCard 
          user={user as User || undefined} 
          githubUser={githubUser || undefined} 
          onRefresh={() => window.location.reload()} 
        />

        <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        <Suspense fallback={<LoadingSpinner />}>
          {selectedTab === "overview" && (
            <Overview
              issueData={issueData || []}
              prData={prData || []}
              commitData={commitData || []}
              orgData={orgData || emptyOrgData}
            />
          )}
          {selectedTab === "repo" && (
            <Repo
              repoData={repoData || emptyRepoData}
              prCount={(prData || []).length || 0}
            />
          )}
          {selectedTab === "issue" && (
            <IssueTracker issueData={issueData || []} />
          )}
          {selectedTab === "pr" && (
            <PRTracker prData={prData || []} />
          )}
          {selectedTab === "commit" && (
            <CommitTracker commits={commitData || []} />
          )}
          {selectedTab === "org" && (
            <OrgTracker orgData={orgData || emptyOrgData} />
          )}
          {selectedTab === "analytics" && (
            <AnalyticsTracker commits={commitData || []} repoData={repoData || emptyRepoData} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
