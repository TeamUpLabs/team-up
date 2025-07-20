import { Project } from "@/types/Project";
import { Notification } from "@/types/Notification";

export interface CollaborationPreference {
    collaboration_style: string;
    preferred_project_type: string;
    preferred_role: string;
    available_time_zone: string;
    work_hours_start: string;
    work_hours_end: string;
    preferred_project_length: string;
}

export interface NotificationSetting {
    emailEnable: number;
    taskNotification: number;
    milestoneNotification: number;
    scheduleNotification: number;
    deadlineNotification: number;
    weeklyReport: number;
    pushNotification: number;
    securityNotification: number;
}

export interface ParticipationRequest {
    project_id: string;
    request_type: string;
    status: string;
    message: string;
    created_at: string;
    processed_at: string;
}

export interface TechStack {
    tech: string;
    level: number;
}

export interface Interest {
    interest_category: string;
    interest_name: string;
}

export interface SocialLink {
    platform: string;
    url: string;
}

export interface Session {
    session_id: string;
    device_id: string;
    user_agent: string;
    geo_location: string;
    ip_address: string;
    browser: string;
    os: string;
    device: string;
    device_type: string;
    last_active_at: string;
    is_current: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    profile_image: string;
    role: string;
    status: string;
    bio: string;
    languages: string[];
    phone: string;
    birth_date: string;
    last_login: string;
    auth_provider: string;
    auth_provider_id: string;
    auth_provider_access_token: string;
    notification_settings: NotificationSetting;
    projects: Project[];
    participation_requests: ParticipationRequest[];
    collaboration_preference: CollaborationPreference;
    tech_stacks: TechStack[];
    interests: Interest[];
    social_links: SocialLink[];
    received_notifications: Notification[];
    sent_notifications: Notification[];
    sessions: Session[];
}

export const blankUser: User = {
    id: 0,
    name: "",
    email: "",
    profile_image: "",
    role: "",
    status: "",
    bio: "",
    languages: [],
    phone: "",
    birth_date: "",
    last_login: "",
    auth_provider: "",
    auth_provider_id: "",
    auth_provider_access_token: "",
    notification_settings: {
        emailEnable: 1,
        taskNotification: 1,
        milestoneNotification: 1,
        scheduleNotification: 1,
        deadlineNotification: 1,
        weeklyReport: 1,
        pushNotification: 1,
        securityNotification: 1,
    },
    projects: [],
    participation_requests: [],
    collaboration_preference: {
        collaboration_style: "",
        preferred_project_type: "",
        preferred_role: "",
        available_time_zone: "",
        work_hours_start: "",
        work_hours_end: "",
        preferred_project_length: "",
    },
    tech_stacks: [],
    interests: [],
    social_links: [],
    received_notifications: [],
    sent_notifications: [],
    sessions: [],
}

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

export interface UpdateUserProfileData {
    name?: string;
    email?: string;
    password?: string;
    profile_image?: string;
    role?: string;
    status?: string;
    bio?: string;
    languages?: string[];
    phone?: string;
    birth_date?: string;
    last_login?: string;
    notification_settings?: NotificationSetting;
    collaboration_preference?: CollaborationPreference;
    tech_stacks?: TechStack[];
    interests?: Interest[];
    social_links?: SocialLink[];
}
