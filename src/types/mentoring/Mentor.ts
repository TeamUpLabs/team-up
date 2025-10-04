import { UserBrief } from "@/types/brief/Userbrief";

export interface Mentor {
  user: UserBrief;
  location: string[];
  experience: string;
  topic: string[];
  bio: string;
  availablefor: string[];
  reviews: {
    id: number;
    rating: number;
    comment: string;
    mentor_id: number;
    created_at: string;
    updated_at: string;
  }[];
  sessions: {
    id: number;
    title: string;
    description: string;
    mentor_id: number;
    mentee_id: number;
    created_at: string;
    updated_at: string;
  }[];
}