import { server } from "@/auth/server";
import { getCurrentKoreanTime } from "@/utils/dateUtils";
import { Comment, SubTask } from "@/types/Task";

interface TaskFormData {
  project_id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  assignee_id: number[];
  tags: string[];
  priority: string;
  subtasks: string[];
  milestone_id: number;
}

export const createTask = async (project_id: string, task: TaskFormData) => {
  try {
    const res = await server.post(`/project/${project_id}/task`, {
      project_id: task.project_id,
      milestone_id: task.milestone_id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      assignee_id: task.assignee_id,
      tags: task.tags,
      priority: task.priority,
      subtasks: task.subtasks.map((subtask) => ({
        id: Date.now() + Math.floor(Math.random() * 10000),
        title: subtask,
        completed: false,
      })),
      createdAt: getCurrentKoreanTime(),
      updatedAt: getCurrentKoreanTime(),
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

interface UpdateTaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee_id: number[];
  tags: string[];
  subtasks: SubTask[];
  comments: Comment[];
  milestone_id: number;
  createdAt: string;
  updatedAt: string;
}

export const updateTask = async (project_id: string, task_id: number, task: UpdateTaskFormData) => {
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
      completed: subtask.completed,
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