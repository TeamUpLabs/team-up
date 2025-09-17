import { UserBrief } from "@/types/user/User";

export interface ParticipationRequest {
  id: number;
  project_id: number;
  sender_id: number;
  receiver_id: number;
  request_type: string;
  status: string;
  message: string;
  created_at: string;
  processed_at: string;
  sender: UserBrief;
  receiver: UserBrief;
}