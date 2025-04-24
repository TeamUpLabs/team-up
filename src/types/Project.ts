import { Member } from "@/types/Member";
import { Task } from "@/types/Task";
import { MileStone } from "@/types/MileStone";

export interface Project {
  id: string;
  title: string;
  status: string;
  description: string;
  leader: Member;
  manager: Member[];
  roles: string[];
  techStack: string[];
  startDate: string;
  endDate: string;
  teamSize: number;
  location: string;
  projectType: string;
  members: Member[];
  tasks: Task[] | [];
  milestones: MileStone[];
}