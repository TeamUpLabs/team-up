import { UserBrief } from "@/types/User";

export interface Channel {
    id: string;
    projectId: string;
    channelId: string;
    channelName: string;
    channelDescription: string;
    isPublic: boolean;
    member_id: number[];
    members: UserBrief[];
    created_at: string;
    created_by: number;
}