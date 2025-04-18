import { server } from "@/auth/server";
import { SignUpFormData } from "@/types/SignUpFormData";
import { getCurrentKoreanTime, getCurrentKoreanTimeDate } from "@/utils/dateUtils";

export const signup = async (data: SignUpFormData) => {
  try {
    // Transform workingHours to match API format
    const transformedWorkingHours = {
      timezone: data.workingHours.timezone,
      start: data.workingHours.workingStartHour,
      end: data.workingHours.workingEndHour
    };

    const requestData = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      contactNumber: data.contactNumber,
      skills: data.skills || [],
      birthDate: data.birthDate,
      workingHours: transformedWorkingHours,
      languages: Array.isArray(data.languages) ? [...data.languages] : [],
      profileImage: "adasd",
      introduction: data.introduction,
      status: "활성",
      lastLogin: getCurrentKoreanTime(),
      createdAt: getCurrentKoreanTimeDate(),
    };
    
    console.log("Sending data to API:", JSON.stringify(requestData, null, 2));
    
    const res = await server.post("/member", requestData, {
      headers: {
        "Content-Type": "application/json",
      },
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

