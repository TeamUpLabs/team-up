import { Member } from "@/types/Member";

export interface Channel {
    id: string;
    projectId: string;
    channelId: string;
    channelName: string;
    channelDescription: string;
    isPublic: boolean;
    member_id: number[];
    members: Member[];
    created_at: string;
    created_by: number;
}