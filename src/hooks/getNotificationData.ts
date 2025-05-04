import { server } from "@/auth/server";
import { checkAndRefreshAuth } from "@/auth/authStore";

export const updateNotification = async (memberId: number, notificationId: number) => {
  try {
    const res = await server.put(`/member/${memberId}/notification/${notificationId}`, {
      isRead: true
    });
    if (res.status === 200) {
      await checkAndRefreshAuth();
      return res.data;
    } else {
      throw new Error("Failed to update notification");
    }
  } catch (error) {
    console.error("Failed to update notification:", error);
    throw error;
  }
};
