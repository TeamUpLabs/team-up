import { server } from "@/auth/server";
import { WhiteBoardCreateFormData, CommentCreateFormData, WhiteBoardUpdateFormData } from "@/types/WhiteBoard";
import { useAuthStore } from "@/auth/authStore";

export const createWhiteBoard = async (project_id: string, whiteBoardData: WhiteBoardCreateFormData) => {
    try {
        const res = await server.post(`/api/v1/projects/${project_id}/whiteboards`, whiteBoardData, {
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
        const res = await server.post(`/api/v1/projects/${project_id}/whiteboards/${whiteboard_id}/comments`, comment, {
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

export const deleteComment = async (project_id: string, whiteboard_id: number, comment_id: number) => {
    try {
        const res = await server.delete(`/api/v1/projects/${project_id}/whiteboards/${whiteboard_id}/comments/${comment_id}`, {
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

export const updateIdea = async (project_id: string, whiteboard_id: number, idea: WhiteBoardUpdateFormData) => {
    try {
        const token = useAuthStore.getState().token;
        if (!token) {
            throw new Error("No authentication token found");
        }
        const res = await server.put(`/api/v1/projects/${project_id}/whiteboards/${whiteboard_id}`, {
          title: idea.title,
          content: idea.content,
          tag: idea.tag,
          updated_by: idea.updated_by,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating idea:", error);
        throw error;
    }
};

export const likeIdea = async (project_id: string, whiteboard_id: number) => {
    try {
        const token = useAuthStore.getState().token;
        if (!token) {
            throw new Error("No authentication token found");
        }
        
        const res = await server.put(`/api/v1/projects/${project_id}/whiteboards/${whiteboard_id}/like`, 
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

export const updateViews = async (project_id: string, whiteboard_id: number) => {
    try {
        const res = await server.put(`/api/v1/projects/${project_id}/whiteboards/${whiteboard_id}/view`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating views:", error);
        throw error;
    }
};
    

export const deleteWhiteBoard = async (project_id: string, whiteboard_id: number) => {
    try {
        const res = await server.delete(`/api/v1/projects/${project_id}/whiteboards/${whiteboard_id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting whiteboard:", error);
        throw error;
    }
};
    