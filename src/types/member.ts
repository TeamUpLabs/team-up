export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  currentTask: string;
  status: string;
  statusTime: string;
  startDate: string;
  skills: string[];
  projects: string[];
  profileImage: string;
  contactNumber: string;
  birthDate: string;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  languages: {
    name: string;
    level: string;
  }[];
  socialLinks: {
    github: string;
    linkedin: string;
  };
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    weekend: boolean;
  };
}
