import { User, UserBrief, blankUser } from "@/types/User";
import { MileStone, blankMileStone } from "@/types/MileStone";

export interface SubTaskCreateFormData {
  title: string;
  is_completed: boolean;
}

export interface SubTask {
  id: number;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommentCreateFormData {
  content: string;
  created_by: number;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  creator: UserBrief;
}

export interface Task {
  id: number;
  project_id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  estimated_hours: number;
  actual_hours: number;
  start_date: string;
  due_date: string;
  milestone_id: number;
  created_at: string;
  updated_at: string;
  completed_at: string;
  milestone: MileStone;
  assignees: User[];
  creator: User;
  subtasks: SubTask[];
  comments: Comment[];
}

export const blankTask: Task = {
  id: 0,
  project_id: "",
  title: "",
  description: "",
  status: "not_started",
  priority: "low",
  estimated_hours: 0,
  actual_hours: 0,
  start_date: "",
  due_date: "",
  milestone_id: 0,
  created_at: "",
  updated_at: "",
  completed_at: "",
  milestone: blankMileStone,
  assignees: [],
  creator: blankUser,
  subtasks: [],
  comments: [],
}

export interface TaskCreateFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  estimated_hours: number;
  start_date: string;
  due_date: string;
  project_id: string;
  milestone_id: number;
  assignee_ids: number[];
  created_by: number;
  subtasks: {
    title: string;
    is_completed: boolean;
  }[];
}

export interface TaskUpdateFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  estimated_hours: number;
  actual_hours: number;
  start_date: string;
  due_date: string;
  milestone_id: number;
  assignee_ids: number[];
}