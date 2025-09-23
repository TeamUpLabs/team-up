import { server } from "@/auth/server";
import { MilestoneCreateFormData, MilestoneUpdateFormData } from "@/types/MileStone";


export const createMilestone = async (project_id: string, milestone: MilestoneCreateFormData) => {
  try {
    const res = await server.post(`/api/v1/projects/${project_id}/milestones`, milestone);
    if (res.status === 201) {
      return res.data;
    } else {
      throw new Error("Failed to create milestone");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteMilestone = async (project_id: string, milestone_id: number) => {
  try {
    const res = await server.delete(`/api/v1/projects/${project_id}/milestones/${milestone_id}`);
    if (res.status === 204) {
      return res.data;
    } else {
      throw new Error("Failed to delete milestone");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const updateMilestone = async (project_id: string, milestone_id: number, milestone: MilestoneUpdateFormData) => {
  try {
    const res = await server.put(`/api/v1/projects/${project_id}/milestones/${milestone_id}`, milestone);
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
