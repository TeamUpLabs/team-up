import { server } from "@/auth/server";

interface MilestoneFormData {
  project_id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  tags: string[];
  assignee_id: number[];
}

export const createMilestone = async (milestone: MilestoneFormData) => {
  try {
    const res = await server.post("/milestone", milestone);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to create milestone");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
