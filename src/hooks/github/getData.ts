import { User } from "@/types/User";
import useSWR from 'swr';

// SWR fetcher for GitHub API
const githubFetcher = (url: string, token: string) => 
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());

export const fetchRepoData = async (org: string, repo: string, user: User) => {
  const res = await fetch('/api/github/repo?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${user?.auth_provider_access_token}`,
    },
  })
  const data = await res.json();
  return data.repo;
}

export const fetchCommitData = async (org: string, repo: string, user: User) => {
  const res = await fetch('/api/github/commits?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${user?.auth_provider_access_token}`,
    },
  })
  const data = await res.json();
  return data.commits;
}

export const fetchIssueData = async (org: string, repo: string, user: User) => {
  const res = await fetch('/api/github/issue?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${user?.auth_provider_access_token}`,
    },
  })
  const data = await res.json();
  return data.issues;
}

export const fetchPrData = async (org: string, repo: string, user: User) => {
  const res = await fetch('/api/github/pr?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${user?.auth_provider_access_token}`,
    },
  })
  const data = await res.json();
  return data.prs;
}

export const fetchUserData = async (user: User) => {
  const res = await fetch('/api/github/user?user=' + user.auth_provider_id, {
    headers: {
      Authorization: `Bearer ${user?.auth_provider_access_token}`,
    },
  })
  const data = await res.json();
  return data.user;
}

export const fetchOrgData = async (org: string, user: User) => {
  const res = await fetch('/api/github/org?org=' + org, {
    headers: {
      Authorization: `Bearer ${user?.auth_provider_access_token}`,
    },
  })
  const data = await res.json();
  return data.org;
}

// SWR hooks for GitHub data with caching
export const useRepoData = (org: string, repo: string, user: User | null) => {
  return useSWR(
    user?.auth_provider_access_token ? `/api/github/repo?org=${org}&repo=${repo}` : null,
    (url) => githubFetcher(url, user!.auth_provider_access_token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5분 캐시
      errorRetryCount: 2,
    }
  );
};

export const useCommitData = (org: string, repo: string, user: User | null) => {
  return useSWR(
    user?.auth_provider_access_token ? `/api/github/commits?org=${org}&repo=${repo}` : null,
    (url) => githubFetcher(url, user!.auth_provider_access_token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5,
      errorRetryCount: 2,
    }
  );
};

export const useIssueData = (org: string, repo: string, user: User | null) => {
  return useSWR(
    user?.auth_provider_access_token ? `/api/github/issue?org=${org}&repo=${repo}` : null,
    (url) => githubFetcher(url, user!.auth_provider_access_token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5,
      errorRetryCount: 2,
    }
  );
};

export const usePrData = (org: string, repo: string, user: User | null) => {
  return useSWR(
    user?.auth_provider_access_token ? `/api/github/pr?org=${org}&repo=${repo}` : null,
    (url) => githubFetcher(url, user!.auth_provider_access_token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5,
      errorRetryCount: 2,
    }
  );
};

export const useUserData = (user: User | null) => {
  return useSWR(
    user?.auth_provider_access_token ? `/api/github/user?user=${user.auth_provider_id}` : null,
    (url) => githubFetcher(url, user!.auth_provider_access_token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 10, // 사용자 데이터는 더 오래 캐시
      errorRetryCount: 2,
    }
  );
};

export const useOrgData = (org: string, user: User | null) => {
  return useSWR(
    user?.auth_provider_access_token ? `/api/github/org?org=${org}` : null,
    (url) => githubFetcher(url, user!.auth_provider_access_token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 10,
      errorRetryCount: 2,
    }
  );
};

export const fetchAllGithubData = async (org: string, repo: string, user: User) => {
  const [repoData, commitData, prData, issueData, githubUser, orgData] = await Promise.all([
    fetchRepoData(org, repo, user),
    fetchCommitData(org, repo, user),
    fetchPrData(org, repo, user),
    fetchIssueData(org, repo, user),
    fetchUserData(user),
    fetchOrgData(org, user),
  ])
  return { repoData, commitData, prData, issueData, githubUser, orgData };
}