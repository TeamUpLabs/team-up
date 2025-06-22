import { CommitData } from "@/types/CommitData";

export interface PrDataBase {
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
  commits_url: string;
  url: string;
}

export interface File {
  additions: number;
  deletions: number;
  changes: number;
  filename: string;
  status: string;
}

export interface Review {
  body: string;
  html_url: string;
  state: string;
  user: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
}

export interface PrData extends PrDataBase {
  files: File[];
  commits: CommitData[];
  reviews: Review[];
}