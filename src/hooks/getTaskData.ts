import { server } from "@/auth/server";
import { getCurrentKoreanTime } from "@/utils/dateUtils";
import { Comment, SubTask, TaskCreateFormData, TaskUpdateFormData } from "@/types/Task";

export const createTask = async (project_id: string, task: TaskCreateFormData) => {
  try {
    const res = await server.post(`/project/${project_id}/task`, {
      project_id: task.project_id,
      milestone_id: task.milestone_id,
      title: task.title,
      description: task.description,
      status: task.status,
      start_date: task.start_date,
      due_date: task.due_date,
      assignee_ids: task.assignee_ids,
      priority: task.priority,
      subtasks: task.subtasks,
      created_by: task.created_by,
      created_at: getCurrentKoreanTime(),
      updated_at: getCurrentKoreanTime(),
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to create task");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteTask = async (project_id: string, taskId: number) => {
  try {
    const res = await server.delete(`/project/${project_id}/task/${taskId}`);
    if (res.status === 200) {
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
    const res = await server.put(`/project/${project_id}/task/${task_id}/status`, {
      status: status,
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
    const res = await server.put(`/project/${project_id}/task/${task_id}`, task);
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

export const updateSubtask = async (project_id: string, task_id: number, subtask: SubTask) => {
  try {
    const res = await server.put(`/project/${project_id}/task/${task_id}/subtask/${subtask.id}/state`, {
      is_completed: subtask.is_completed,
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

export const addComment = async (project_id: string, task_id: number, comment: Comment) => {
  try {
    const res = await server.post(`/project/${project_id}/task/${task_id}/comment`, comment, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to add comment");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteComment = async (project_id: string, task_id: number, comment_id: number) => {
  try {
    const res = await server.delete(`/project/${project_id}/task/${task_id}/comment/${comment_id}`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to delete comment");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
  