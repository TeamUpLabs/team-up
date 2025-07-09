import { Project } from "@/types/Project";
import { Notification } from "@/types/Notification";

export interface CollaborationPreference {
    collaboration_style: string;
    preferred_project_type: string;
    preferred_role: string;
    available_time_zone: string;
    work_hours_start: number;
    work_hours_end: number;
    preferred_project_length: string;
}

export interface NotificationSetting {
    emailEnable: number;
    taskNotification: number;
    milestoneNotification: number;
    scheduleNotification: number;
    deadlineNotification: number;
    weeklyNotification: number;
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

export interface User {
    id: number;
    name: string;
    email: string;
    profile_image: string;
    role: string;
    status: string;
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
}