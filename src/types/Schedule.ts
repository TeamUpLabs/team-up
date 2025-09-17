import { Project, blankProject } from "@/types/Project";
import { UserBrief, blankUserBrief } from "@/types/brief/Userbrief";

export interface ScheduleCreateFormData {
    type: "meeting" | "event";
    title: string;
    description: string;
    where: string;
    link: string;
    start_time: string;
    end_time: string;
    status: "not_started" | "in_progress" | "completed";
    memo: string;
    project_id: string;
    assignee_ids: number[];
    created_by: number;
    updated_by: number;
}

export const blankScheduleCreateFormData: ScheduleCreateFormData = {
    type: "meeting",
    title: "",
    description: "",
    where: "",
    link: "",
    start_time: "",
    end_time: "",
    status: "not_started",
    memo: "",
    project_id: "",
    assignee_ids: [],
    created_by: 0,
    updated_by: 0,
}

export interface ScheduleUpdateFormData {
    type: "meeting" | "event";
    title: string;
    description: string;
    where: string;
    link: string;
    start_time: string;
    end_time: string;
    status: "not_started" | "in_progress" | "completed";
    memo: string;
    assignee_ids: number[];
}

export interface Schedule {
    id: number;
    type: "meeting" | "event";
    title: string;
    description: string;
    where: string;
    link: string;
    start_time: string;
    end_time: string;
    status: "not_started" | "in_progress" | "completed";
    memo: string;
    created_at: string;
    updated_at: string;
    project_id: string;

    project: Project;
    creator: UserBrief;
    updater: UserBrief;
    assignees: UserBrief[];
}

export const blankSchedule: Schedule = {
    id: 0,
    type: "meeting",
    title: "",
    description: "",
    where: "",
    link: "",
    start_time: "",
    end_time: "",
    status: "not_started",
    memo: "",
    created_at: "",
    updated_at: "",
    project_id: "",
    project: blankProject,
    creator: blankUserBrief,
    updater: blankUserBrief,
    assignees: [],
}