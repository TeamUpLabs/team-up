import { server } from "@/auth/server";
import { NewMentorReviewForm } from "@/types/mentoring/MentorReview";

export const createReview = async (review: NewMentorReviewForm) => {
  try {
    const res = await server.post(`/api/v1/mentors/reviews/`, review);
    if (res.status === 201) {
      return res.data;
    } else {
      throw new Error("Failed to create review");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};