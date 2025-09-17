export interface UserBrief {
  id: number;
  name: string;
  email: string;
  profile_image: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;

  links: {
    self: {
      href: string;
      method: string;
      title: string;
    }
  };
}

export const blankUserBrief: UserBrief = {
  id: 0,
  name: "",
  email: "",
  profile_image: "",
  role: "",
  status: "",
  created_at: "",
  updated_at: "",
  links: {
    self: {
      href: "",
      method: "",
      title: "",
    }
  },
}