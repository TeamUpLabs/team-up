import { User, blankUser } from "@/types/User";
import { Task } from "@/types/Task";

export interface MileStone {
  id: number;
  project_id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed" | "on_hold";
  priority: "low" | "medium" | "high";
  start_date: string;
  due_date: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  progress: number;
  assignee: User[];
  creator: User;
  tasks: Task[];
  tasks_count: number;
  completed_task_count: number;
}

export const blankMileStone: MileStone = {
  id: 0,
  project_id: "",
  title: "",
  description: "",
  status: "not_started",
  priority: "low",
  start_date: "",
  due_date: "",
  tags: [],
  created_at: "",
  updated_at: "",
  progress: 0,
  assignee: [],
  creator: blankUser,
  tasks: [],
  tasks_count: 0,
  completed_task_count: 0,
}