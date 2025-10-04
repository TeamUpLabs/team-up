export interface MentorSession {
  id: number;
  title: string;
  description: string;
  mentor_id: number;
  mentee_id: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}