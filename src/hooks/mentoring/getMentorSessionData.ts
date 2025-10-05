import { server } from "@/auth/server";
import { NewSessionForm } from "@/types/mentoring/MentorSession";

export const createSession = async (session: NewSessionForm) => {
  try {
    const res = await server.post(`/api/v1/mentors/sessions/`, session);
    if (res.status === 201) {
      return res.data;
    } else {
      throw new Error("Failed to create session");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};