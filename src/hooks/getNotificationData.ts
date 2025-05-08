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

export const deleteNotification = async (memberId: number, notificationId: number) => {
  try {
    const res = await server.delete(`/member/${memberId}/notification/${notificationId}`);
    if (res.status === 200) {
      await checkAndRefreshAuth();
      return res.data;
    } else {
      throw new Error("Failed to delete notification");
    }
  } catch (error) {
    console.error("Failed to delete notification:", error);
    throw error;
  }
};

export const deleteAllNotifications = async (memberId: number) => {
  try {
    const res = await server.delete(`/member/${memberId}/notifications`);
    if (res.status === 200) {
      await checkAndRefreshAuth();
      return res.data;
    } else {
      throw new Error("Failed to delete all notifications");
    }
  } catch (error) {
    console.error("Failed to delete all notifications:", error);
    throw error;
  }
};
