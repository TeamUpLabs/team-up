export interface PrData {
  total_count: number;
  items: {
    id: number;
    state: string;
    title: string;
    body: string;
    created_at: string;
    updated_at: string;
    merged_at: string;
    closed_at: string;
    merged: boolean;
    html_url: string;
    repository_url: string;
    assignee: {
      login: string;
      avatar_url: string;
    };
  }[];
}