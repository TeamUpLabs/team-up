import { server } from "@/auth/server";
import { getCurrentKoreanTimeDate } from "@/utils/dateUtils";
import { MilestoneCreateFormData, MilestoneUpdateFormData } from "@/types/MileStone";
import { useAuthStore } from "@/auth/authStore";


export const createMilestone = async (project_id: string, milestone: MilestoneCreateFormData) => {
  try {
    const res = await server.post(`/project/${project_id}/milestone`, {
      ...milestone,
      createdAt: getCurrentKoreanTimeDate(),
      updatedAt: getCurrentKoreanTimeDate(),
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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

export const deleteMilestone = async (project_id: string, milestoneId: number) => {
  try {
    const res = await server.delete(`/project/${project_id}/milestone/${milestoneId}`);
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
