export interface RepoData {
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: {
    name: string;
  },
  owner: {
    login: string;
    avatar_url: string;
  },
  topics: string[];
  language: string;
}