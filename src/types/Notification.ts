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

export const blankNotification: Notification = {
    id: 0,
    title: "",
    message: "",
    timestamp: "",
    is_read: false,
    type: "info",
    sender_id: 0,
    receiver_id: 0,
    project_id: "",
    result: "",
};
