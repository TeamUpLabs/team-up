export interface CommitData {
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
}