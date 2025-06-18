"use client";

import { useEffect, useState, useCallback } from "react";
import { useProject } from "@/contexts/ProjectContext";
import GithubRepoCreate from "@/layouts/GithubRepoCreate";
import { useAuthStore } from "@/auth/authStore";
import RepoCard from "@/components/project/github/RepoCard";
import IssueCard from "@/components/project/github/IssueCard";
import PRCard from "@/components/project/github/PRCard";
import CommitCard, { CommitData } from "@/components/project/github/CommitCard";
import ProfileCard from "@/components/project/github/ProfileCard";
import Tab from "@/components/project/github/Tab";
import Overview from "@/components/project/github/overview/overview";
import {
  fetchCommitData,
  fetchIssueData,
  fetchPrData,
  fetchRepoData,
  fetchUserData,
  fetchOrgData
} from "@/hooks/github/getData";

export default function GithubPage() {
  const { project } = useProject();
  const user = useAuthStore.getState().user;
  const [repoData, setRepoData] = useState({});
  const [prData, setPrData] = useState({
    total_count: 0,
    items: []
  });
  const [commitData, setCommitData] = useState<CommitData[]>([]);
  const [issueData, setIssueData] = useState([]);
  const [githubUser, setGithubUser] = useState({
    name: "",
    login: "",
    email: "",
    html_url: "",
    avatar_url: "",
    public_repos: 0,
    followers: 0,
    following: 0,
    company: "",
    location: "",
  });
  const [orgData, setOrgData] = useState({
    name: "",
    login: "",
    description: "",
    public_repos: 0,
    collaborators: 0,
    avatar_url: "",
    html_url: "",
    company: "",
    location: "",
  });
  const [selectedTab, setSelectedTab] = useState<'overview' | 'repo' | 'issue' | 'pr' | 'commit' | 'cicd' | 'org' | 'analytics'>("overview");

  const fetchCommit = useCallback(async (org: string, repo: string) => {
    const data = await fetchCommitData(org, repo, user!);
    setCommitData(data);
  }, [user])

  const fetchRepo = useCallback(async (org: string, repo: string) => {
    const data = await fetchRepoData(org, repo, user!);
    console.log(data);
    setRepoData(data);
  }, [user])

  const fetchIssue = useCallback(async (org: string, repo: string) => {
    const data = await fetchIssueData(org, repo, user!);
    setIssueData(data);
  }, [user])

  const fetchPr = useCallback(async (org: string, repo: string) => {
    const data = await fetchPrData(org, repo, user!);
    setPrData(data);
  }, [user])


  const fetchUser = useCallback(async () => {
    const data = await fetchUserData(user!);
    setGithubUser(data);
  }, [user])

  const fetchOrg = useCallback(async (org: string) => {
    const data = await fetchOrgData(org, user!);
    setOrgData(data);
  }, [user])

  useEffect(() => {
    const fetchAllData = async () => {
      if (project?.github_repo_url) {
        const org = "TeamUpLabs";
        const repo = project.github_repo_url.split("/").pop()!;

        await Promise.all([
          fetchRepo(org, repo),
          fetchCommit(org, repo),
          fetchPr(org, repo),
          fetchIssue(org, repo),
          fetchUser(),
          fetchOrg(org)
        ]);
      }
    };
  
    fetchAllData();
  }, [project, user, fetchRepo, fetchPr, fetchCommit, fetchIssue, fetchUser, fetchOrg]);

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
            <IssueCard issueLength={issueData?.length || 0} />
            <PRCard prData={prData || {}} />
            <CommitCard commitData={commitData || {}} />
          </div>

          <ProfileCard githubUser={githubUser} />

          <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

          {selectedTab === "overview" && <Overview issueData={issueData} prData={prData} commitData={commitData} orgData={orgData} />}
        </div>
      ) : (
        <GithubRepoCreate />
      )}
    </div>
  );
}