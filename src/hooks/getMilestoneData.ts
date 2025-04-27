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

export const deleteMilestone = async (milestoneId: number) => {
  try {
    const res = await server.delete(`/milestone/${milestoneId}`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to delete milestone");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const updateMilestone = async (project_id: string, milestone_id: number, milestone: MilestoneFormData) => {
  try {
    const res = await server.put(`/project/${project_id}/milestone/${milestone_id}`, milestone);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update milestone");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
