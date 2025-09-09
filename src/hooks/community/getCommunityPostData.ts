import { server } from "@/auth/server";
import { createPostData } from "@/types/community/Post";
import { useAuthStore } from "@/auth/authStore";

export const getAllCommunityPostData = async () => {
    try {
        const res = await server.get(`/community/posts/all`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Failed to fetch community posts");
        }
    } catch (error) {
        console.error("Error fetching community posts:", error);
        throw error;
    }
}

export const createCommunityPost = async (data: createPostData) => {
    try {
        const token = useAuthStore.getState().token;
        const res = await server.post(`/community/posts`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Failed to create community post");
        }
    } catch (error) {
        console.error("Error creating community post:", error);
        throw error;
    }
}

export const likeCommunityPost = async (postId: number) => {
    try {
        const token = useAuthStore.getState().token;
        const res = await server.post(`/community/posts/${postId}/likes`, null, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Failed to like community post");
        }
    } catch (error) {
        console.error("Error liking community post:", error);
        throw error;
    }
}

export const unlikeCommunityPost = async (postId: number) => {
    try {
        const token = useAuthStore.getState().token;
        const res = await server.delete(`/community/posts/${postId}/likes`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Failed to unlike community post");
        }
    } catch (error) {
        console.error("Error unliking community post:", error);
        throw error;
    }
}

export const dislikeCommunityPost = async (postId: number) => {
    try {
        const token = useAuthStore.getState().token;
        const res = await server.post(`/community/posts/${postId}/dislikes`, null, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Failed to dislike community post");
        }
    } catch (error) {
        console.error("Error disliking community post:", error);
        throw error;
    }
}

export const undislikeCommunityPost = async (postId: number) => {
    try {
        const token = useAuthStore.getState().token;
        const res = await server.delete(`/community/posts/${postId}/dislikes`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Failed to undislike community post");
        }
    } catch (error) {
        console.error("Error undisliking community post:", error);
        throw error;
    }
}

export const createComment = async (post_id: number, comment: string) => {
    try {
        const token = useAuthStore.getState().token;
        const res = await server.post(`/community/posts/${post_id}/comments`, { content: comment }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Failed to create comment");
        }
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
}

export const deleteComment = async (post_id: number, comment_id: number) => {
    try {
        const token = useAuthStore.getState().token;
        const res = await server.delete(`/community/posts/${post_id}/comments/${comment_id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Failed to delete comment");
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}

