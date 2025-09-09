export type RecommendedFollow = {
  user_id: number;
  name: string;
  email: string;
  profile_image?: string;
  bio?: string;
  role?: string;
  similarity_score: number;
  common_tech_stacks: string[];
  common_interests: string[];
};