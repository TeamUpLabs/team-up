export interface UserBrief {
  id: number;
  name: string;
  email: string;
  profile_image: string;
  role: string;
  status: string;
}

export const blankUserBrief: UserBrief = {
  id: 0,
  name: "",
  email: "",
  profile_image: "",
  role: "",
  status: "",
}