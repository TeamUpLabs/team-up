import { Member } from "@/types/Member";

export interface SubTask {
  id: number;
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
  startDate?: string;
  endDate?: string;
  tags: string[];
  subtasks: SubTask[];
  comments: Comment[];
  milestone_id: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}