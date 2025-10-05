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

export const blankMentorSession: MentorSession = {
  id: 0,
  title: "",
  description: "",
  mentor_id: 0,
  mentee_id: 0,
  start_date: "",
  end_date: "",
  created_at: "",
  updated_at: "",
};

export interface NewSessionForm {
  mentor_id: number;
  mentee_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export const blankNewSessionForm: NewSessionForm = {
  mentor_id: 0,
  mentee_id: 0,
  title: "",
  description: "",
  start_date: "",
  end_date: "",
};