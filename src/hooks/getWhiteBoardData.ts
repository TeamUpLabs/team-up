import { server } from "@/auth/server";
import { WhiteBoardCreateFormData, CommentCreateFormData } from "@/types/WhiteBoard";

export const createWhiteBoard = async (whiteBoardData: WhiteBoardCreateFormData) => {
    try {
        const res = await server.post("/whiteboards", whiteBoardData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating whiteboard:", error);
        throw error;
    }
};

export const addComment = async (project_id: string, whiteboard_id: number, comment: CommentCreateFormData) => {
    try {
        const res = await server.post(`/projects/${project_id}/whiteboards/${whiteboard_id}/comments`, comment, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

export const deleteComment = async (whiteboard_id: number, comment_id: number) => {
    try {
        const res = await server.delete(`/whiteboards/${whiteboard_id}/comments/${comment_id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};

    