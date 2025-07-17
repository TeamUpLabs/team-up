export const fetchRepoData = async (org: string, repo: string, auth_access_token: string) => {
  const res = await fetch('/api/github/repo?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${auth_access_token}`,
    },
  })
  const data = await res.json();
  return data.repo;
}

export const fetchCommitData = async (org: string, repo: string, auth_access_token: string) => {
  const res = await fetch('/api/github/commits?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${auth_access_token}`,
    },
  })
  const data = await res.json();
  return data.commits;
}

export const fetchIssueData = async (org: string, repo: string, auth_access_token: string) => {
  const res = await fetch('/api/github/issue?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${auth_access_token}`,
    },
  })
  const data = await res.json();
  return data.issues;
}

export const fetchPrData = async (org: string, repo: string, auth_access_token: string) => {
  const res = await fetch('/api/github/pr?org=' + org + '&repo=' + repo, {
    headers: {
      Authorization: `Bearer ${auth_access_token}`,
    },
  })
  const data = await res.json();
  return data.prs;
}

export const fetchUserData = async (auth_provider_id: string, auth_provider_access_token: string) => {
  const res = await fetch('/api/github/user?user=' + auth_provider_id, {
    headers: {
      Authorization: `Bearer ${auth_provider_access_token}`,
    },
  })
  const data = await res.json();
  return data.user;
}

export const fetchOrgData = async (org: string, auth_access_token: string) => {
  const res = await fetch('/api/github/org?org=' + org, {
    headers: {
      Authorization: `Bearer ${auth_access_token}`,
    },
  })
  const data = await res.json();
  return data.org;
}

export const fetchAllGithubData = async (org: string, repo: string, auth_provider_id: string, auth_provider_access_token: string) => {
  const [repoData, commitData, prData, issueData, githubUser, orgData] = await Promise.all([
    fetchRepoData(org, repo, auth_provider_access_token),
    fetchCommitData(org, repo, auth_provider_access_token),
    fetchPrData(org, repo, auth_provider_access_token),
    fetchIssueData(org, repo, auth_provider_access_token),
    fetchUserData(auth_provider_id, auth_provider_access_token),
    fetchOrgData(org, auth_provider_access_token),
  ])
  return { repoData, commitData, prData, issueData, githubUser, orgData };
}