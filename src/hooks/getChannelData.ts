import { server } from "@/auth/server";
import { getCurrentKoreanTimeDate } from "@/utils/dateUtils";

const generateId = (length = 8): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

interface ChannelData {
  channelName: string;
  channelDescription: string;
  isPublic: boolean;
  member_id: number[];
  created_by: number;
}

export const createChannel = async (project_id: string, channelData: ChannelData) => {
  try {
    const res = await server.post(`/project/${project_id}/channel`, {
      projectId: project_id,
      channelId: generateId(),
      channelName: channelData.channelName,
      channelDescription: channelData.channelDescription,
      isPublic: channelData.isPublic,
      member_id: channelData.member_id,
      created_at: getCurrentKoreanTimeDate(),
      created_by: channelData.created_by,
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

  