import { server } from "@/auth/server";
import { SignUpFormData } from "@/types/SignUpFormData";
import { getCurrentKoreanTime, getCurrentKoreanTimeDate } from "@/utils/dateUtils";

export const signup = async (data: SignUpFormData) => {
  const transformedWorkingHours = {
    timezone: data.workingHours.timezone,
    start: data.workingHours.workingStartHour,
    end: data.workingHours.workingEndHour
  };

  let profileImageFile = null;
  try {
    const imageUrl = '/DefaultProfile.jpg';
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    profileImageFile = new File([blob], "DefaultProfile.jpg", { type: blob.type });
  } catch (error) {
    console.error("Error fetching logo image:", error);
  }

  const formData = new FormData();
  
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    contactNumber: data.contactNumber,
    skills: data.skills,
    birthDate: data.birthDate,
    workingHours: transformedWorkingHours,
    languages: data.languages,
    introduction: data.introduction,
    status: '비활성',
    lastLogin: getCurrentKoreanTime(),
    createdAt: getCurrentKoreanTimeDate(),
  };

  try {
    if (profileImageFile) {
      formData.append('profileImage', profileImageFile);
    }
    formData.append('payload', JSON.stringify(payload));

    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
      
    const res = await server.post("/member", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to sign up");
    }
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
} 

