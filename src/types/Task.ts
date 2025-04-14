import { TeamMember } from "@/types/Member";

interface SubTask {
  title: string;
  completed: boolean;
}

interface Comment {
  author_id: number;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: TeamMember[];
  dueDate?: string;
  tags: string[];
  subtasks: SubTask[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}