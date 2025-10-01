import { CollaborationPreference } from "@/types/user/CollaborationPreference";
import { TechStack } from "@/types/user/TechStack";
import { Interest } from "@/types/user/Interest";
import { SocialLink } from "@/types/user/SocialLink";
import { UserBrief } from "@/types/brief/Userbrief";

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
    auth: {
      provider: string;
      provider_id: string;
      provider_access_token: string;
    };
    notification_settings: NotificationSetting;
    following: {
      count: number;
      users: UserBrief[];
    };
    followers: {
      count: number;
      users: UserBrief[];
    };

    links: {
      self: {
        href: string;
        method: string;
        title: string;
      },
      projects: {
        my: {
          href: string;
          method: string;
          title: string;
        },
        exclude_me: {
          href: string;
          method: string;
          title: string;
        }
      },
      exclude_projects: {
        href: string;
        method: string;
        title: string;
      },
      collaboration_preferences: {
        href: string;
        method: string;
        title: string;
      },
      tech_stacks: {
        href: string;
        method: string;
        title: string;
      },
      interests: {
        href: string;
        method: string;
        title: string;
      },
      social_links: {
        href: string;
        method: string;
        title: string;
      },
      notifications: {
        href: string;
        method: string;
        title: string;
      },
      sessions: {
        href: string;
        method: string;
        title: string;
      }
    };
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
    auth: {
      provider: "",
      provider_id: "",
      provider_access_token: "",
    },
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

    following: {
      count: 0,
      users: [],
    },
    followers: {
      count: 0,
      users: [],
    },

    links: {
      self: {
        href: "",
        method: "",
        title: "",
      },
      projects: {
        my: {
          href: "",
          method: "",
          title: "",
        },
        exclude_me: {
          href: "",
          method: "",
          title: "",
        }
      },
      exclude_projects: {
        href: "",
        method: "",
        title: "",
      },
      collaboration_preferences: {
        href: "",
        method: "",
        title: "",
      },
      tech_stacks: {
        href: "",
        method: "",
        title: "",
      },
      interests: {
        href: "",
        method: "",
        title: "",
      },
      social_links: {
        href: "",
        method: "",
        title: "",
      },
      notifications: {
        href: "",
        method: "",
        title: "",
      },
      sessions: {
        href: "",
        method: "",
        title: "",
      },
    },
}

// export interface User {
//     id: number;
//     name: string;
//     email: string;
//     profile_image: string;
//     role: string;
//     status: string;
//     bio: string;
//     languages: string[];
//     phone: string;
//     birth_date: string;
//     last_login: string;
//     auth_provider: string;
//     auth_provider_id: string;
//     auth_provider_access_token: string;
//     notification_settings: NotificationSetting;
//     projects: Project[];
//     participation_requests: ParticipationRequest[];
//     collaboration_preference: CollaborationPreference;
//     tech_stacks: TechStack[];
//     interests: Interest[];
//     social_links: SocialLink[];
//     received_notifications: Notification[];
//     sent_notifications: Notification[];
//     sessions: Session[];

//     following: UserBrief[];
//     followers: UserBrief[];

//     posts: Post[];
//     bookmarked_posts: Post[];
//     liked_posts: Post[];
// }

// export const blankUser: User = {
//     id: 0,
//     name: "",
//     email: "",
//     profile_image: "",
//     role: "",
//     status: "",
//     bio: "",
//     languages: [],
//     phone: "",
//     birth_date: "",
//     last_login: "",
//     auth_provider: "",
//     auth_provider_id: "",
//     auth_provider_access_token: "",
//     notification_settings: {
//         emailEnable: 1,
//         taskNotification: 1,
//         milestoneNotification: 1,
//         scheduleNotification: 1,
//         deadlineNotification: 1,
//         weeklyReport: 1,
//         pushNotification: 1,
//         securityNotification: 1,
//     },
//     projects: [],
//     participation_requests: [],
//     collaboration_preference: {
//         collaboration_style: "",
//         preferred_project_type: "",
//         preferred_role: "",
//         available_time_zone: "",
//         work_hours_start: "",
//         work_hours_end: "",
//         preferred_project_length: "",
//     },
//     tech_stacks: [],
//     interests: [],
//     social_links: [],
//     received_notifications: [],
//     sent_notifications: [],
//     sessions: [],

//     following: [],
//     followers: [],

//     posts: [],
//     bookmarked_posts: [],
//     liked_posts: [],
// }

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
