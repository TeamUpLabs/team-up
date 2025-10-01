import { server } from "@/auth/server";
import { createPostData } from "@/types/community/Post";

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
    const res = await server.post(`/api/v1/community/posts`, data);
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
    const res = await server.post(`/api/v1/community/posts/${postId}/likes`, null);
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
        const res = await server.delete(`/api/v1/community/posts/${postId}/likes`);
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
    const res = await server.post(`/api/v1/community/posts/${postId}/dislikes`, null);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to dislike community post");
    }
  } catch (error) {
    throw error;
  }
}

export const undislikeCommunityPost = async (postId: number) => {
  try {
    const res = await server.delete(`/api/v1/community/posts/${postId}/dislikes`);
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
    const res = await server.post(`/api/v1/community/posts/${post_id}/comments`, { content: comment });
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
    const res = await server.delete(`/api/v1/community/posts/${post_id}/comments/${comment_id}`);
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

export const bookmarkCommunityPost = async (post_id: number) => {
  try {
    const res = await server.post(`/api/v1/community/posts/${post_id}/bookmark`, null);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to bookmark community post");
    }
  } catch (error) {
    console.error("Error bookmarking community post:", error);
    throw error;
  }
} 

export const unbookmarkCommunityPost = async (post_id: number) => {
  try {
    const res = await server.delete(`/api/v1/community/posts/${post_id}/bookmark`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to unbookmark community post");
    }
  } catch (error) {
    console.error("Error unbookmarking community post:", error);
    throw error;
  }
}