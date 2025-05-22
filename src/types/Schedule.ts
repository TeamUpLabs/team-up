import { Member } from "@/types/Member";

export interface Schedule {
    id: number;
    project_id: string;
    title: string;
    description: string;
    where: string;
    link?: string;
    start_time: string;
    end_time: string;
    status: "not-started" | "in-progress" | "completed";
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    memo?: string;
    assignee: Member[];
}
