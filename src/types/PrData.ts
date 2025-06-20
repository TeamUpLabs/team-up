export interface PrData {
  id: number;
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
    login: string;
    avatar_url: string;
  };
}