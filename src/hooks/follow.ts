import { server } from "@/auth/server";
import { useAuthStore } from "@/auth/authStore";

export const followUser = async (userId: number) => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await server.post(`/follows/${userId}`, null, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const unfollowUser = async (userId: number) => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error("No authentication token found");
  }
  try {
    const response = await server.delete(`/follows/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};