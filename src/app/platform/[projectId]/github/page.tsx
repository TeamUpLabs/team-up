"use client";

import { useEffect, useState, useCallback } from "react";
import { useProject } from "@/contexts/ProjectContext";
import GithubRepoCreate from "@/layouts/GithubRepoCreate";
import { useAuthStore } from "@/auth/authStore";
import RepoCard from "@/components/project/github/RepoCard";
import IssueCountCard from "@/components/project/github/IssueCountCard";
import PRCountCard from "@/components/project/github/PRCountCard";
import CommitCountCard from "@/components/project/github/CommitCountCard";
import ProfileCard from "@/components/project/github/ProfileCard";
import Tab from "@/components/project/github/Tab";
import Overview from "@/components/project/github/overview/overview";
import Repo from "@/components/project/github/repo/repo";
import {
  fetchCommitData,
  fetchIssueData,
  fetchPrData,
  fetchRepoData,
  fetchUserData,
  fetchOrgData,
} from "@/hooks/github/getData";
import { IssueData } from "@/types/IssueData";
import { RepoData } from "@/types/RepoData";
import { PrData } from "@/types/PrData";
import { GithubUser } from "@/types/GithubUser";
import { OrgData } from "@/types/OrgData";
import { CommitData } from "@/types/CommitData";
import IssueTracker from "@/components/project/github/issue/IssueTracker";
import PRTracker from "@/components/project/github/pr/PRTracker";
import CommitTracker from "@/components/project/github/commit/CommitTracker";
import OrgTracker from "@/components/project/github/org/OrgTracker";

export default function GithubPage() {
  const { project } = useProject();
  const user = useAuthStore.getState().user;
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [prData, setPrData] = useState<PrData[]>([]);
  const [commitData, setCommitData] = useState<CommitData[]>([]);
  const [issueData, setIssueData] = useState<{ items: IssueData[] }>({ items: [] });
  const [githubUser, setGithubUser] = useState<GithubUser | null>(null);
  const [orgData, setOrgData] = useState<OrgData | null>(null);
  const [selectedTab, setSelectedTab] = useState<
    | "overview"
    | "repo"
    | "issue"
    | "pr"
    | "commit"
    | "org"
    | "analytics"
  >("overview");

  const fetchCommit = useCallback(
    async (org: string, repo: string) => {
      const data = await fetchCommitData(org, repo, user!);
      setCommitData(data);
    },
    [user]
  );

  const fetchRepo = useCallback(
    async (org: string, repo: string) => {
      const data = await fetchRepoData(org, repo, user!);
      setRepoData(data);
    },
    [user]
  );

  const fetchIssue = useCallback(
    async (org: string, repo: string) => {
      const data = await fetchIssueData(org, repo, user!);
      setIssueData({ items: data });
    },
    [user]
  );

  const fetchPr = useCallback(
    async (org: string, repo: string) => {
      const data = await fetchPrData(org, repo, user!);
      setPrData(data);
    },
    [user]
  );

  const fetchUser = useCallback(async () => {
    const data = await fetchUserData(user!);
    setGithubUser(data);
  }, [user]);

  const fetchOrg = useCallback(
    async (org: string) => {
      const data = await fetchOrgData(org, user!);
      console.log(data);
      setOrgData(data);
    },
    [user]
  );

  useEffect(() => {
    const fetchAllData = async () => {
      if (project?.github_repo_url) {
        const org = "TeamUpLabs";
        const repo = "team-up";

        await Promise.all([
          fetchRepo(org, repo),
          fetchCommit(org, repo),
          fetchPr(org, repo),
          fetchIssue(org, repo),
          fetchUser(),
          fetchOrg(org),
        ]);
      }
    };

    fetchAllData();
  }, [
    project,
    user,
    fetchRepo,
    fetchPr,
    fetchCommit,
    fetchIssue,
    fetchUser,
    fetchOrg,
  ]);



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
  };


  return (
    <div className="flex items-start justify-center py-20 px-4">
      {!project ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-xl font-semibold text-text-primary">
            프로젝트를 불러오는 중입니다. 잠시만 기다려주세요...
          </p>
        </div>
      ) : project?.github_repo_url ? (
        <div className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <RepoCard repoData={repoData || {}} />
            <IssueCountCard issueLength={(issueData.items || []).filter((issue) => issue.state === "open").length || 0} state="open" />
            <PRCountCard prCount={(prData || []).filter((pr) => pr.state === "open").length || 0} state="open" />
            <CommitCountCard commitData={commitData || {}} />
          </div>

          <ProfileCard user={user || undefined} githubUser={githubUser || undefined} />

          <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

          {selectedTab === "overview" && (
            <Overview
              issueData={issueData || { items: [] }}
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
            <IssueTracker issueData={issueData || { items: [] }} />
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
        </div>
      ) : (
        <GithubRepoCreate />
      )}
    </div>
  );
}
