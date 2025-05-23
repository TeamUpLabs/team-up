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
  