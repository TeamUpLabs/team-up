export type NotificationAlertType = "info" | "message" | "task" | "milestone" | "chat" | "scout";

export interface Notification {
    id: number;
    title: string;
    message: string;
    timestamp: string;
    is_read: boolean;
    type: NotificationAlertType;
    sender_id: number;
    receiver_id: number;
    project_id: string;
    result: string;
}