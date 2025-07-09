import { CollaborationPreference, TechStack, Interest } from "@/types/User";

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  skills: string[];
  birthDate: string;
  workingHours: {
    timezone: string;
    start: string;
    end: string;
  };
  languages: string[];
  introduction: string;
}

export interface ExtraInfoFormData {
  role: string;
  status: string;
  languages: string[];
  phone: string;
  birth_date: string;
  last_login: string;
  collaboration_preference: CollaborationPreference;
  tech_stacks: TechStack[];
  interests: Interest[];
}
