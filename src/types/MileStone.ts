export interface MileStone {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'not-started';
  assignee: string;
}