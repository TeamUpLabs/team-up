import { server } from "@/auth/server";
import { ChannelCreateForm, ChannelUpdateForm } from "@/types/Channel";

const generateId = (length = 8): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const createChannel = async (formData: ChannelCreateForm) => {
  try {
    const res = await server.post(`/channels`, {
      ...formData,
      channel_id: generateId(),
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to create channel");
    }
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
};

export const getChannel = async (project_id: string, channel_id: string) => {
  try {
    const res = await server.get(`/project/${project_id}/channel/${channel_id}`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to get channel");
    }
  } catch (error) {
    console.error("Error getting channel:", error);
    throw error;
  }
};

export const updateChannel = async (channel_id: string, channelData: ChannelUpdateForm) => {
  try {
    const res = await server.put(`/channels/${channel_id}`, channelData);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update channel");
    }
  } catch (error) {
    console.error("Error updating channel:", error);
    throw error;
  }
};

export const deleteChannel = async (channel_id: string) => {
  try {
    const res = await server.delete(`/channels/${channel_id}`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to delete channel");
    }
  } catch (error) {
    console.error("Error deleting channel:", error);
    throw error;
  }
};

  