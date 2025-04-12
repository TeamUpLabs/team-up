import { server } from "@/auth/server";

export const getAllProjects = async () => {
  try {
    const res = await server.get(`/project`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch project data");
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
    throw error;
  }
};

export const getProjectByMemberId = async (member_id: number) => {
  try {
    const res = await server.get(`/member/${member_id}/project`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch project data");
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
    throw error;
  }
};