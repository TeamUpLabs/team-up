import { UserBrief } from "@/types/brief/Userbrief";

export interface ParticipationRequest {
  id: number;
  project_id: string;
  user_id: number;
  message: string;
  request_type: string;
  status: string;
  created_at: string;
  processed_at: string;
  user: UserBrief;
}