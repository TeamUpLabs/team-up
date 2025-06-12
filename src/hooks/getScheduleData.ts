import { server } from "@/auth/server";
import { getCurrentKoreanTimeDate } from "@/utils/dateUtils";

interface ScheduleFormData {
  project_id: string;
  type: string;
  title: string;
  description: string;
  where: string;
  link: string;
  start_time: string;
  end_time: string;
  status: string;
  created_by: number | undefined;
  updated_by: number | undefined;
  memo: string;
  assignee_id: number[];
}

export const createSchedule = async (project_id: string, formData: ScheduleFormData) => {
  try {
    const res = await server.post(`/project/${project_id}/schedule`, {
      ...formData,
      created_at: getCurrentKoreanTimeDate(),
      updated_at: getCurrentKoreanTimeDate(),
    }, {
      headers: {
        "Content-Type": "application/json",
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
    const res = await server.get(`/project/${project_id}/schedules`, {
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

interface ScheduleUpdateFormData {
  title: string;
  description: string;
  link: string;
  start_time: string;
  end_time: string;
  assignee_id: number[];
  where: string;
  status: string;
  memo: string;
}

export const updateSchedule = async (project_id: string, schedule_id: number, formData: ScheduleUpdateFormData) => {
  try {
    const res = await server.put(`/project/${project_id}/schedule/${schedule_id}`, {
      ...formData,
      updated_at: getCurrentKoreanTimeDate(),
    }, {
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
    const res = await server.delete(`/project/${project_id}/schedule/${schedule_id}`, {
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
  
  