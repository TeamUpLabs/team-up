import { UserBrief, blankUserBrief } from "@/types/User";

export interface WhiteBoardCreateFormData {
  type: string;
  project_id: string;  
  title: string;
  content: string;
  attachments: {
    filename: string;
    file_url: string;
    file_type: string;
    file_size: number;
  }[];
  tags: string[];
  created_by: number;
  updated_by: number;
}

export const blankWhiteBoardCreateFormData: WhiteBoardCreateFormData = {
  type: "",
  project_id: "",
  title: "",
  content: "",
  attachments: [],
  tags: [],
  created_by: 0,
  updated_by: 0,
};

export interface Attachment {
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  creator: UserBrief;
}

export interface CommentCreateFormData {
  content: string;
  creator: UserBrief;
}

export interface WhiteBoardDocument {
  content: string;
  tags: string[];
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
}
  
export interface WhiteBoard {
  id: number;
  type: string;
  project_id: string;  
  title: string;
  documents: WhiteBoardDocument[];
  created_at: string;
  updated_at: string;
  creator: UserBrief;
  updater: UserBrief;

  likes: number;
  comments: Comment[];
  views: number;
}

export const blankWhiteBoard: WhiteBoard = {
  id: 0,
  type: "",
  project_id: "",
  title: "",
  documents: [],
  created_at: "",
  updated_at: "",
  creator: blankUserBrief,
  updater: blankUserBrief,

  likes: 0,
  comments: [],
  views: 0,
};

export interface WhiteBoardUpdateFormData {
  id: number;
  title: string;
  content: string;
  documents: WhiteBoardDocument[];
  updated_by: number;
}

export const blankWhiteBoardUpdateFormData: WhiteBoardUpdateFormData = {
  id: 0,
  title: "",
  content: "",
  documents: [],
  updated_by: 0,
};


