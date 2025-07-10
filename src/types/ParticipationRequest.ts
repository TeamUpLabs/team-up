import { UserBrief } from "@/types/User";

export interface ParticipationRequest {
  id: number;
  project_id: number;
  user_id: number;
  request_type: string;
  status: string;
  message: string;
  created_at: string;
  processed_at: string;
  user: UserBrief;
}