export interface Activity {
  id: string | number;
  type: 'commit' | 'issue' | 'pr';
  title: string;
  author: string;
  date: string;
  url: string;
  state?: 'open' | 'closed' | 'merged';
  repoName: string;
}
