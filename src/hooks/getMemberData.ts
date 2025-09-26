import { server } from "@/auth/server";
import { User, UpdateUserProfileData } from "@/types/user/User";
import { useAuthStore } from "@/auth/authStore";

export const getMembersExceptMe = async (): Promise<User[]> => {
  try { 
    const user = useAuthStore.getState().user;
    const res = await server.get(`/users/exclude/${user?.id}`);
    
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
    const res = await server.get(`/users/check?email=${email}`);
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

export const sendScout = async (project_id: string, project_name: string, receiver_id: number) => {
  try {
    const res = await server.post(`/participation-requests`, {
      project_id: project_id,
      sender_id: receiver_id,
      receiver_id: receiver_id,
      request_type: "scout",
      message: `'${project_name}' 프로젝트에 스카우트 요청을 받았습니다!`,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to send scout");
    }
  } catch (error) {
    console.error("Error sending scout:", error);
    throw error;
  }
}

export const acceptScout = async (member_id: number, notification_id: number) => {
  try {
    const res = await server.post(`/member/${member_id}/notification/${notification_id}/scout/accept`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to accept scout");
    }
  } catch (error) {
    console.error("Error accepting scout:", error);
    throw error;
  }
}

export const rejectScout = async (member_id: number, notification_id: number) => {
  try {
    const res = await server.post(`/member/${member_id}/notification/${notification_id}/scout/reject`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to reject scout");
    }
  } catch (error) {
    console.error("Error rejecting scout:", error);
    throw error;
  }
}

export const sendParticipationRequest = async (project_id: string, user_id: number) => {
  try {
    const res = await server.post(`/api/v1/projects/${project_id}/participation_requests`, {
      project_id: project_id,
      user_id: user_id,
      request_type: "request",
      message: "해당 프로젝트에 참여하고 싶습니다!",
    });
    if (res.status === 201) {
      return res.data;
    } else {
      throw new Error("Failed to send participation request");
    }
  } catch (error) {
    console.error("Error sending participation request:", error);
    throw error;
  }
}

export const cancelParticipationRequest = async (project_id: string, request_id: number) => {
  try {
    const res = await server.put(`/api/v1/projects/${project_id}/participation_requests/${request_id}/cancel`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to cancel participation request");
    }
  } catch (error) {
    console.error("Error canceling participation request:", error);
    throw error;
  }
}

export const updateUserProfile = async (memberData: UpdateUserProfileData) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.put(`/users/me`, memberData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update member");
    }
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
}

export const updateUserProfileImage = async (memberId: number, imageUrl: string) => {
  const formData = new FormData();
  if (imageUrl.startsWith('blob:')) {
    const response = await fetch(imageUrl);
    const blobData = await response.blob();
    const profileImageFile = new File([blobData], "profileImage.jpg", { type: blobData.type });
    formData.append('profileImage', profileImageFile);
  } else {
    throw new Error("Expected a blob URL for image upload");
  }
  
  try {
    const res = await server.put(`/member/${memberId}/profile-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update member profile image");
    }
  } catch (error) {
    console.error("Error updating member profile image:", error);
    throw error;
  }
}