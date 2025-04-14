import { TeamMember } from "@/types/Member";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: TeamMember[];
  dueDate?: string;
  tags: string[];
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