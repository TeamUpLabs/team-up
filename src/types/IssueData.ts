export interface IssueData {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  assignee: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  } | null;
  labels: {
    id: number;
    name: string;
    color: string;
    description?: string;
  }[];
  html_url: string;
  body: string;
  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
  };
}