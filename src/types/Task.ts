import { Member } from "@/types/Member";

export interface SubTask {
  title: string;
  completed: boolean;
}

export interface Comment {
  author_id: number;
  content: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: Member[];
  dueDate?: string;
  tags: string[];
  subtasks: SubTask[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  milestone_id: number;
}