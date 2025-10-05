import { Mentor, blankMentor } from "@/types/mentoring/Mentor";
import { UserBrief, blankUserBrief } from "@/types/brief/Userbrief";

export interface MentorReview {
  id: number;
  rating: number;
  comment: string;
  mentor: Mentor;
  user: UserBrief;
  created_at: string;
  updated_at: string;
}

export const blankMentorReview: MentorReview = {
  id: 0,
  rating: 0,
  comment: "",
  mentor: blankMentor,
  user: blankUserBrief,
  created_at: "",
  updated_at: "",
};

export interface NewMentorReviewForm {
  rating: number;
  comment: string;
  mentor_id: number;
  user_id: number;
  
}

export const blankNewMentorReviewForm: NewMentorReviewForm = {
  rating: 0,
  comment: "",
  mentor_id: 0,
  user_id: 0,
};