import { UserBrief, blankUserBrief } from "@/types/User";

export interface Post {
  id: number;
  content: string;
  code?: {
    language: string;
    code: string;
  };
  tags: string[];
  created_at: string;
  updated_at: string;

  creator: UserBrief;

  reaction: {
    likes: number;
    dislikes: number;
    comments: Comment[];
    views: number;
    shares: number;
  },
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;

  creator: UserBrief;
}

export const blankPost: Post = {
  id: 0,
  content: "",
  code: undefined,
  tags: [],
  created_at: "",
  updated_at: "",

  creator: blankUserBrief,

  reaction: {
    likes: 0,
    dislikes: 0,
    comments: [],
    views: 0,
    shares: 0,
  },
}

export const blankComment: Comment = {
  id: 0,
  content: "",
  created_at: "",
  updated_at: "",

  creator: blankUserBrief,
}

export interface createPostData {
  content: string;
  code?: {
    language: string;
    code: string;
  };
  tags: string[];
  user_id: number;
}

export const blankCreatePostData: createPostData = {
  content: "",
  code: {
    language: "javascript",
    code: "",
  },
  tags: [],
  user_id: 0,
}