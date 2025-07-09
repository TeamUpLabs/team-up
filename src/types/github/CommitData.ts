export interface CommitDataBase {
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
  };
  html_url: string;
  author: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  }
  url: string;
  sha: string;
}

export interface CommitDetail {
  files: {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
  }[];
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
}

export interface CommitData extends CommitDataBase {
  commitDetail: CommitDetail;
}