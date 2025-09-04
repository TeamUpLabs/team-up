import { UserBrief, blankUserBrief } from "@/types/User";

export interface Post {
  id: number;
  content: string;
  code: string;
  code_language: string;
  is_code: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;

  creator: UserBrief;
  updator: UserBrief;

  comments: Comment[];

  reaction: {
    likes: number;
    comments: number;
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
  code: "",
  code_language: "",
  is_code: false,
  tags: [],
  created_at: "",
  updated_at: "",

  creator: blankUserBrief,
  updator: blankUserBrief,

  comments: [],

  reaction: {
    likes: 0,
    comments: 0,
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
  code: string;
  code_language: string;
  is_code: boolean;
  tags: string[];
}

export const blankCreatePostData: createPostData = {
  content: "",
  code: "",
  code_language: "javascript",
  is_code: false,
  tags: [],
}