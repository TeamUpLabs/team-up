import { Channel } from "@/types/Channel";
import { UserBrief, blankUserBrief } from "@/types/brief/Userbrief";
import { blankChannel } from "@/types/Channel";

export interface ChatCreateForm {
  project_id: string;
  channel_id: string;
  message: string;
}

export const blankChatCreateForm: ChatCreateForm = {
  project_id: "",
  channel_id: "",
  message: "",
}

export interface Chat {
  id: number;
  project_id: string;
  channel_id: string;
  user_id: number;
  message: string;
  timestamp: string;

  channel: Channel;
  user: UserBrief;
}

export const blankChat: Chat = {
  id: 0,
  project_id: "",
  channel_id: "",
  user_id: 0,
  message: "",
  timestamp: "",
  channel: blankChannel,
  user: blankUserBrief,
};