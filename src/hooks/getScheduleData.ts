import { server } from "@/auth/server";
import { ScheduleCreateFormData, ScheduleUpdateFormData } from "@/types/Schedule";
import { useAuthStore } from "@/auth/authStore";

export const createSchedule = async (project_id: string, formData: ScheduleCreateFormData) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.post(`/projects/${project_id}/schedules`, formData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token || ""}`,
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to create schedule");
    }
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};

export const getScheduleByProject = async (project_id: string) => {
  try {
    const res = await server.get(`/projects/${project_id}/schedules`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch schedule data");
    }
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    throw error;
  }
};

export const updateSchedule = async (project_id: string, schedule_id: number, formData: ScheduleUpdateFormData) => {
  try {
    const res = await server.put(`/projects/${project_id}/schedules/${schedule_id}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update schedule");
    }
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (project_id: string, schedule_id: number) => {
  try {
    const res = await server.delete(`/projects/${project_id}/schedules/${schedule_id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to delete schedule");
    }
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};
  
  