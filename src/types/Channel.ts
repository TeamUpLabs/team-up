import { UserBrief } from "@/types/brief/Userbrief";

export interface ChannelCreateForm {
  name: string;
  description: string;
  is_public: boolean;
  project_id: string;
  channel_id: string;
  member_ids: number[];
  created_by: number;
  updated_by: number;
}

export const blankChannelCreateForm: ChannelCreateForm = {
  name: "",
  description: "",
  is_public: true,
  project_id: "",
  channel_id: "",
  member_ids: [],
  created_by: 0,
  updated_by: 0,
}

export interface ChannelUpdateForm {
  name: string;
  description: string;
  is_public: boolean;
  member_ids: number[];
  updated_by: number;
}

export const blankChannelUpdateForm: ChannelUpdateForm = {
  name: "",
  description: "",
  is_public: true,
  member_ids: [],
  updated_by: 0,
}

export interface Channel {
  project_id: string;
  channel_id: string;
  name: string;
  description: string;
  is_public: boolean;
  
  created_at: string;
  updated_at: string;

  created_by: number;
  updated_by: number;

  member_count: number;
  members: {
    user: UserBrief;
    role: string;
    joined_at: string;
  }[];

  chats: {
    self: {
      href: string;
      method: string;
      title: string;
    }
  }
}

export const blankChannel: Channel = {
  project_id: "",
  channel_id: "",
  name: "",
  description: "",
  is_public: false,
  created_at: "",
  updated_at: "",
  created_by: 0,
  updated_by: 0,  
  member_count: 0,
  members: [],
  chats: {
    self: {
      href: "",
      method: "",
      title: ""
    }
  }
};
  