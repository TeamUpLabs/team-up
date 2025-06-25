export interface GithubUser {
  name: string;
  login: string;
  email: string;
  html_url: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  company: string;
  location: string;
}