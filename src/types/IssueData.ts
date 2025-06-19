export interface IssueData {
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  number: number;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: {
    name: string;
    color: string;
  }[];
  comments: number;
  assignees: {
    login: string;
    avatar_url: string;
  }[];
}