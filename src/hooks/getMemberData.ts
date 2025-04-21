import { server } from "@/auth/server";
import { Member } from "@/types/Member";

export const getAllMembers = async (): Promise<Member[]> => {
  try { 
    const res = await server.get("/member", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch members");
    }
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
}

export const checkMember = async (email: string) => {
  try {
    const res = await server.post(`/member/check`, {
      email: email
    });
    if (res.status === 200) {
      if (res.data.status === "exists") {
        return true;
      } else {
        return false;
      }
    } else {
      throw new Error("Failed to check member");
    }
  } catch (error) {
    console.error("Error checking member:", error);
    throw error;
  }
}

export const updateProjectMember = async (projectId: string, memberId: number) => {
  try {
    const res = await server.post(`/project/${projectId}/member`, {
      member_id: memberId,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update project member");
    }
  } catch (error) {
    console.error("Error updating project member:", error);
    throw error;
  }
}