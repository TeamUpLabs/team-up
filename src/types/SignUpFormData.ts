export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  contactNumber: string;
  skills: string[];
  birthDate: string;
  workingHours: {
    timezone: string;
    workingStartHour: string;
    workingEndHour: string;
  };
  languages: string[];
  introduction: string;
}