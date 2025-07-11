import { server } from "@/auth/server";
import { MilestoneCreateFormData, MilestoneUpdateFormData } from "@/types/MileStone";
import { useAuthStore } from "@/auth/authStore";


export const createMilestone = async (milestone: MilestoneCreateFormData) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.post(`/milestones`, milestone, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
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

export const deleteMilestone = async (milestoneId: number) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.delete(`/milestones/${milestoneId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
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


export const updateMilestone = async (milestone_id: number, milestone: MilestoneUpdateFormData) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.put(`/milestones/${milestone_id}`, milestone, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
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
