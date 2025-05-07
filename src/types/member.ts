import { Task } from "@/types/Task";
import { Project } from "@/types/Project";

export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type?: "info" | "message" | "task" | "milestone" | "chat" | "scout";
}

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
  projects: string[];
  projectDetails: Project[];
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
  socialLinks: {
    name: string;
    url: string;
  }[];
  participationRequests: number[];
  notification: Notification[];
}
