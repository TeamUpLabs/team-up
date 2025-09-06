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
