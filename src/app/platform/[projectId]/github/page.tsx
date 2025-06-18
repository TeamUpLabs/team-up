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

export default function GithubPage() {
  const { project } = useProject();
  const user = useAuthStore.getState().user;
  const [repoData, setRepoData] = useState({});
  const [prData, setPrData] = useState({});
  const [commitData, setCommitData] = useState<CommitData[]>([]);
  const [githubUser, setGithubUser] = useState({
    name: "",
    login: "",
    email: "",
    avatar_url: "",
    public_repos: 0,
    followers: 0,
    following: 0,
    company: "",
    location: "",
  });

  const fetchCommit = useCallback(async () => {
    const res = await fetch('/api/github/commits?repo=team-up', {
      headers: {
        Authorization: `Bearer ${user?.github_access_token}`,
      },
    })
    const data = await res.json();
    setCommitData(data.commits);
  }, [user?.github_access_token])

  const fetchRepo = useCallback(async () => {
    const res = await fetch('/api/github/repo?repo=team-up', {
      headers: {
        Authorization: `Bearer ${user?.github_access_token}`,
      },
    })
    const data = await res.json();
    setRepoData(data.repo);
  }, [user?.github_access_token])

  const fetchPr = useCallback(async () => {
    const res = await fetch('/api/github/pr?repo=team-up', {
      headers: {
        Authorization: `Bearer ${user?.github_access_token}`,
      },
    })
    const data = await res.json();
    setPrData(data.prs);
  }, [user?.github_access_token])


  const fetchUser = useCallback(async () => {
    const res = await fetch('/api/github/user?user=' + user?.github_id, {
      headers: {
        Authorization: `Bearer ${user?.github_access_token}`,
      },
    })
    const data = await res.json();
    console.log(data.user);
    setGithubUser(data.user);
  }, [user?.github_access_token, user?.github_id])

  useEffect(() => {
    if (project?.github_repo_url) {
      fetchRepo()
      fetchCommit()
      fetchPr()
      fetchUser()
    }
  }, [project, user?.github_access_token, fetchRepo, fetchPr, fetchCommit, fetchUser]);

  return (
    <div className="flex items-start justify-center py-20 px-4 max-h-screen">
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
            <RepoCard repoData={repoData} />
            <IssueCard repoData={repoData} />
            <PRCard prData={prData} />
            <CommitCard commitData={commitData} />
          </div>

          <ProfileCard githubUser={githubUser} />
        </div>
      ) : (
        <GithubRepoCreate />
      )}
    </div>
  );
}