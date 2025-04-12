import { TeamMember } from "@/types/Member";

export interface Project {
  id: string;
  title: string;
  status: string;
  description: string;
  roles: string[];
  techStack: string[];
  startDate: string;
  endDate: string;
  teamSize: number;
  location: string;
  projectType: string;
  members: TeamMember[];
}