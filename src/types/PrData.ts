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
  comments_url: string;
  url: string;
  head: {
    label: string;
    ref: string;
    sha: string;
    user: {
      login: string;
      id: number;
      avatar_url: string;
      html_url: string;
    };
  };
  base: {
    label: string;
    ref: string;
    sha: string;
    user: {
      login: string;
      id: number;
      avatar_url: string;
      html_url: string;
    };
  };
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

export interface Comment {
  body: string;
  created_at: string;
  html_url: string;
  reactions: {
    "+1": number;
    "-1": number;
    confused: number;
    eyes: number;
    heart: number;
    hooray: number;
    laugh: number;
    rocket: number;
    total_count: number;
    url: string;
  }
  user: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: string;
  }
}

export interface PrData extends PrDataBase {
  files: File[];
  commits: CommitData[];
  reviews: Review[];
  comments: Comment[];
}