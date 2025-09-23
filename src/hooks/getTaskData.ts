import { server } from "@/auth/server";
import { CommentCreateFormData, SubTaskCreateFormData, SubTaskUpdateFormData, TaskCreateFormData, TaskUpdateFormData } from "@/types/Task";
import { useAuthStore } from "@/auth/authStore";

export const createTask = async (task: TaskCreateFormData) => {
  try {
    const res = await server.post(`/api/v1/projects/${task.project_id}/tasks`, {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      start_date: task.start_date,
      due_date: task.due_date,
      project_id: task.project_id,
      milestone_id: task.milestone_id,
      assignee_ids: task.assignee_ids,
      created_by: task.created_by,
      subtasks: task.subtasks,
    });
    if (res.status === 201) {
      return res.data;
    } else {
      throw new Error("Failed to create task");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteTask = async (taskId: number) => {
  try {
    const res = await server.delete(`/api/v1/projects/${taskId}`, {
    });
    if (res.status === 204) {
      return res.data;
    } else {
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const updateTaskStatus = async (project_id: string, task_id: number, status: string) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.put(`/api/v1/projects/${project_id}/tasks/${task_id}`, { status: status }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update task status");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const updateTask = async (project_id: string, task_id: number, task: TaskUpdateFormData) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.put(`/api/v1/projects/${project_id}/tasks/${task_id}`, task, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update task");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const createSubtask = async (task_id: number, subtask: SubTaskCreateFormData) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.post(`/api/v1/tasks/${task_id}/subtasks`, subtask, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (res.status === 201) {
      return res.data;
    } else {
      throw new Error("Failed to create subtask");
    }
  } catch (error) { 
    console.error(error);
    throw error;
  }
}

export const updateSubtask = async (task_id: number, subtask: SubTaskUpdateFormData) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.put(`/api/v1/tasks/${task_id}/subtasks/${subtask.id}`, subtask, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update subtask");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteSubtask = async (task_id: number, subtask_id: number) => { 
  try {
    const token = useAuthStore.getState().token;
    const res = await server.delete(`/api/v1/tasks/${task_id}/subtasks/${subtask_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },  
    });
    if (res.status === 204) {
      return res.data;
    } else {
      throw new Error("Failed to delete subtask");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const addComment = async (project_id: string, task_id: number, comment: CommentCreateFormData) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.post(`/api/v1/tasks/${task_id}/comments`, comment, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (res.status === 201) {
      return res.data;
    } else {
      throw new Error("Failed to add comment");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteComment = async (task_id: number, comment_id: number) => {
  try {
    const token = useAuthStore.getState().token;
    const res = await server.delete(`/api/v1/tasks/${task_id}/comments/${comment_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (res.status === 204) {
      return res.data;
    } else {
      throw new Error("Failed to delete comment");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
  