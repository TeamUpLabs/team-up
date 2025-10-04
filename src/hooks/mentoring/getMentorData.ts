import { server } from "@/auth/server";
import { MentorFormData } from "@/types/mentoring/Mentor";

export const createMentor = async (mentor: MentorFormData) => {
  try {
    const res = await server.post(`/api/v1/mentors`, mentor);
    if (res.status === 201) {
      return res.data;
    } else {
      throw new Error("Failed to create mentor");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};