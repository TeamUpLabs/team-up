import { Member } from "@/types/Member";
import { Task } from "@/types/Task";
import { MileStone } from "@/types/MileStone";
import { Schedule } from "@/types/Schedule";
import { Channel } from "@/types/Channel";

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
  participationRequest: number[];
  participationRequestMembers: Member[];
  schedules: Schedule[];
  channels: Channel[];
  github_repo_url: string;
}