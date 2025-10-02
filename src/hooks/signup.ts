import { server } from "@/auth/server";
import { SignUpFormData } from "@/types/SignUpFormData";
import { getCurrentKoreanTime } from "@/utils/dateUtils";

export const signup = async (data: SignUpFormData) => {
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    profile_image: "https://vnaetwpgkoexfobnveuv.supabase.co/storage/v1/object/public/profile-images/default-profile-image.jpg",
    job: data.job,
    languages: data.languages,
    phone: data.phone,
    status: 'inactive',
    bio: data.bio,
    birth_date: data.birth_date,
    last_login: getCurrentKoreanTime(),
    collaboration_preference: data.collaboration_preference,
    tech_stacks: data.tech_stacks,
    interests: data.interests,
  };

  try {
    const res = await server.post("/users", payload);
    
    if (res.status === 201) {
      return res.data;
    } else {
      throw new Error("Failed to sign up");
    }
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
} 

