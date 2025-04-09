export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  tags: string[];
  progress: number;
  subtasks: {
    title: string;
    completed: boolean;
  }[];
  comments: {
    author: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}