import { Member } from "@/types/Member";

export const fetchRepoData = async (org: string, repo: string, user: Member) => {
  const res = await fetch('/api/github/repo?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${user?.github_access_token}`,
    },
  })
  const data = await res.json();
  return data.repo;
}

export const fetchCommitData = async (org: string, repo: string, user: Member) => {
  const res = await fetch('/api/github/commits?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${user?.github_access_token}`,
    },
  })
  const data = await res.json();
  return data.commits;
}

export const fetchIssueData = async (org: string, repo: string, user: Member) => {
  const res = await fetch('/api/github/issue?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${user?.github_access_token}`,
    },
  })
  const data = await res.json();
  return data.issues;
}

export const fetchPrData = async (org: string, repo: string, user: Member) => {
  const res = await fetch('/api/github/pr?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${user?.github_access_token}`,
    },
  })
  const data = await res.json();
  return data.prs;
}

export const fetchUserData = async (user: Member) => {
  const res = await fetch('/api/github/user?user=' + user.github_id, {
    headers: {
      Authorization: `Bearer ${user?.github_access_token}`,
    },
  })
  const data = await res.json();
  return data.user;
}

export const fetchOrgData = async (org: string, user: Member) => {
  const res = await fetch('/api/github/org?org=' + org, {
    headers: {
      Authorization: `Bearer ${user?.github_access_token}`,
    },
  })
  const data = await res.json();
  return data.org;
}