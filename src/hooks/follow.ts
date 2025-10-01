import { server } from "@/auth/server";

export const followUser = async (user_id: number, target_id: number) => {
  try {
    const response = await server.post(`/api/v1/users/${user_id}/follow`, {
      follower_id: user_id,
      followed_id: target_id,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const unfollowUser = async (user_id: number, target_id: number) => {
  try { 
    const response = await server.delete(`/api/v1/users/${user_id}/follow`, {
      data: {
        follower_id: user_id,
        followed_id: target_id,
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};