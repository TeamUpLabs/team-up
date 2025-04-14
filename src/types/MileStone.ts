import { Task } from "@/types/Task";
import { TeamMember } from "@/types/Member";

export interface MileStone {
  id: number;
  project_id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'in-progress' | 'done' | 'not-started';
  assignee: TeamMember[] | [];
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  subtasks: Task[];
}