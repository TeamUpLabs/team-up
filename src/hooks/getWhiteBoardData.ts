import { server } from "@/auth/server";
import { WhiteBoardCreateFormData, CommentCreateFormData, WhiteBoard } from "@/types/WhiteBoard";
import { useAuthStore } from "@/auth/authStore";

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

export const addComment = async (whiteboard_id: number, comment: CommentCreateFormData) => {
    try {
        const res = await server.post(`/whiteboards/${whiteboard_id}/comments`, comment, {
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

export const updateIdea = async (whiteboard_id: number, idea: WhiteBoard) => {
    try {
        const res = await server.put(`/whiteboards/${whiteboard_id}`, idea, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating idea:", error);
        throw error;
    }
};

export const likeIdea = async (whiteboard_id: number) => {
    try {
        const token = useAuthStore.getState().token;
        if (!token) {
            throw new Error("No authentication token found");
        }
        
        const res = await server.put(`/whiteboards/${whiteboard_id}/like`, 
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
        
        if (!res.data) {
            throw new Error("No data in response");
        }
        
        return res.data;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        throw new Error(errorMessage);
    }
};

    