import { UserBrief, blankUserBrief } from "@/types/user/User";

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
    likes: {
      count: number;
      users: UserBrief[];
    };
    dislikes: {
      count: number;
      users: UserBrief[];
    };
    comments: Comment[];
    views: {
      count: number;
      users: UserBrief[];
    };
    shares: {
      count: number;
      users: UserBrief[];
    };
  },

  bookmark: {
    is_bookmarked: boolean;
    count: number;
    users: UserBrief[];
  }
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;

  user: UserBrief;
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
    likes: {
      count: 0,
      users: [],
    },
    dislikes: {
      count: 0,
      users: [],
    },
    comments: [],
    views: {
      count: 0,
      users: [],
    },
    shares: {
      count: 0,
      users: [],
    },
  },

  bookmark: {
    is_bookmarked: false,
    count: 0,
    users: [],
  }
}

export const blankComment: Comment = {
  id: 0,
  content: "",
  created_at: "",
  updated_at: "",

  user: blankUserBrief,
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