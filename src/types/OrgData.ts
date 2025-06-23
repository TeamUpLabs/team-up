export interface OrgDataBase {
  name: string;
  login: string;
  description: string;
  public_repos: number;
  collaborators: number;
  avatar_url: string;
  html_url: string;
  company: string;
  location: string;
  repos_url: string;
}

export interface Member {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Repo {
  name: string;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  private: boolean;
  html_url: string;
  description: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: {
    name: string;
    key: string;
    spdx_id: string;
    url: string;
    node_id: string;
  };
  topics: string[];
  language: string;
}

export interface OrgData extends OrgDataBase {
  members: Member[];
  repos: Repo[];
}
