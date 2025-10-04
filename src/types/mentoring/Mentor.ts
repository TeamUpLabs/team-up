import { UserBrief, blankUserBrief } from "@/types/brief/Userbrief";
import { MentorReview } from "@/types/mentoring/MentorReview";
import { MentorSession } from "@/types/mentoring/MentorSession";

export interface Mentor {
  user: UserBrief;
  location: string[];
  experience: number;
  topic: string[];
  bio: string;
  availablefor: string[];
  
  links: {
     self: {
      href: string;
      method: string;
      title: string;
     },
     reviews: {
      href: string;
      method: string;
      title: string;
     },
     sessions: {
      href: string;
      method: string;
      title: string;
     }
  }
}

export const blankMentor: Mentor = {
  user: blankUserBrief,
  location: [],
  experience: 0,
  topic: [],
  bio: "",
  availablefor: [],
  links: {
    self: {
      href: "",
      method: "",
      title: "",
    },
    reviews: {
      href: "",
      method: "",
      title: "",
    },
    sessions: {
      href: "",
      method: "",
      title: "",
    }
  }
};

export interface MentorExtended extends Mentor {
  reviews: MentorReview[];
  sessions: MentorSession[];
}

export interface MentorFormData {
  location: string[];
  experience: number;
  topic: string[];
  availablefor: string[];
  bio: string;
  user_id: number;
}

export const blankMentorFormData: MentorFormData = {
  location: [],
  experience: 0,
  topic: [],
  availablefor: [],
  bio: "",
  user_id: 0,
};
