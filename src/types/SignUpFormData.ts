import { CollaborationPreference } from "@/types/user/CollaborationPreference";
import { TechStack } from "@/types/user/TechStack";
import { Interest } from "@/types/user/Interest";

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  profile_image: string;
  job: string;
  languages: string[];
  phone: string;
  status: string;
  bio: string;
  birth_date: string;
  last_login: string;
  collaboration_preference: CollaborationPreference;
  tech_stacks: TechStack[];
  interests: Interest[];
}

export interface ExtraInfoFormData {
  job: string;
  status: string;
  languages: string[];
  phone: string;
  birth_date: string;
  last_login: string;
  collaboration_preference: CollaborationPreference;
  tech_stacks: TechStack[];
  interests: Interest[];
}
