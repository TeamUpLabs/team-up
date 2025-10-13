import { UserBrief, blankUserBrief } from "@/types/brief/Userbrief";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ResourceLink {
  href: string;
  method: HttpMethod;
  title: string;
}

interface ResourceLinks {
  self: ResourceLink;
  post: Omit<ResourceLink, 'method'> & { method: 'POST' };
  put: Omit<ResourceLink, 'method'> & { method: 'PUT' };
  delete: Omit<ResourceLink, 'method'> & { method: 'DELETE' };
}

type ResourceType = 'tasks' | 'milestones' | 'participation_requests' | 'schedules' | 'channels' | 'whiteboards';
type ResourceLinksMap = {
  [K in ResourceType]: ResourceLinks;
};

const blankResourceLink: ResourceLink = {
  href: "",
  method: "GET",
  title: ""
}

export interface ProjectMember {
  user: UserBrief;
  role: string;
  joined_at: string;
}

export interface Project extends Partial<ResourceLinksMap> {
  id: string;
  title: string;
  description: string;
  status: string;
  visibility: string;
  team_size: number;
  project_type: string;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
  tags: string[];
  location: string;
  github_url?: string[];
  completed_at: string;
  owner: UserBrief
  members: ProjectMember[];
  links?: {
    tasks: ResourceLink;
    milestones: ResourceLink;
    participation_requests: ResourceLink;
    schedules: ResourceLink;
    channels: ResourceLink;
    whiteboards: ResourceLink;
  };
  stats?: {
    total_tasks: number;
    completed_tasks: number;
    total_milestones: number;
    completed_milestones: number;
    progress_percentage: number;
    days_remaining: number;
  }
}

export const blankProject: Project = {
  id: "",
  title: "",
  description: "",
  status: "",
  visibility: "",
  team_size: 0,
  project_type: "",
  created_at: "",
  updated_at: "",
  start_date: "",
  end_date: "",
  tags: [],
  location: "",
  github_url: [],
  completed_at: "",
  owner: blankUserBrief,
  members: [],
  links: {
    tasks: blankResourceLink,
    milestones: blankResourceLink,
    participation_requests: blankResourceLink,
    schedules: blankResourceLink,
    channels: blankResourceLink,
    whiteboards: blankResourceLink,
  },
  stats: {
    total_tasks: 0,
    completed_tasks: 0,
    total_milestones: 0,
    completed_milestones: 0,
    progress_percentage: 0,
    days_remaining: 0,
  }
}

// export interface Project {
//   id: string;
//   title: string;
//   description: string;
//   status: string;
//   visibility: string;
//   start_date: string;
//   end_date: string;
//   team_size: number;
//   project_type: string;
//   tags: string[];
//   location: string;
//   github_url: string;
//   completed_at: string;
//   owner: AuthUser;
//   members: {
//     user: User;
//     is_leader: boolean;
//     is_manager: boolean;
//     joined_at: string;
//     role: string;
//   }[];
//   tasks: Task[];
//   milestones: MileStone[];
//   participation_requests: ParticipationRequest[];
//   schedules: Schedule[];
//   channels: Channel[];
//   whiteboards: WhiteBoard[];
//   task_count: number;
//   task_completed_count: number;
//   milestone_count: number;
//   completed_milestone_count: number;
//   participation_request_count: number;
//   schedule_count: number;
//   channel_count: number;
//   chat_count: number;
//   whiteboard_count: number;
// }

// export const blankProject: Project = {
//   id: "",
//   title: "",
//   description: "",
//   status: "",
//   visibility: "",
//   start_date: "",
//   end_date: "",
//   team_size: 0,
//   project_type: "",
//   tags: [],
//   location: "", 
//   github_url: "",
//   completed_at: "",
//   owner: blankUser,
//   members: [],
//   tasks: [],
//   milestones: [],
//   participation_requests: [],
//   schedules: [],
//   channels: [],
//   whiteboards: [],
//   task_count: 0,
//   task_completed_count: 0,
//   milestone_count: 0,
//   completed_milestone_count: 0,
//   participation_request_count: 0,
//   schedule_count: 0,
//   channel_count: 0,
//   chat_count: 0,
//   whiteboard_count: 0,
// }

export interface ProjectFormData {
  title: string;
  description: string;
  status: string;
  visibility: string;
  team_size: number;
  start_date: string;
  end_date: string;
  owner_id: number;
  tags: string[];
  project_type: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export const blankProjectFormData: ProjectFormData = {
  title: "",
  description: "",
  status: "",
  visibility: "",
  team_size: 0,
  start_date: "",
  end_date: "",
  owner_id: 0,
  tags: [],
  project_type: "",
  location: "",
  created_at: "",
  updated_at: "",
}

export interface ProjectUpdateData {
  title: string;
  description: string;
  status: string;
  visibility: string;
  team_size: number;
  start_date: string;
  end_date: string;
  tags: string[];
  project_type: string;
  location: string;
}