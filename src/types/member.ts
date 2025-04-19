import { Task } from "@/types/Task";
import { Project } from "@/types/Project";

export interface Member {
  id: number;
  name: string;
  email?: string;
  role: string;
  currentTask: Task[];
  status: string;
  lastLogin: string;
  createdAt: string;
  skills: string[];
  projects: Project[];
  profileImage: string;
  contactNumber: string;
  birthDate: string;
  introduction: string;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  languages: string[];
  socialLinks: [{
    github: string;
    linkedin: string;
  }];
}
