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

