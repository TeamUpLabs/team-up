export interface PrData {
  id: number;
  number: number;
  state: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  merged_at: string;
  closed_at: string;
  html_url: string;
  repository_url: string;
  assignee: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  };
  labels: {
    name: string;
    color: string;
  }[];
  user: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
}