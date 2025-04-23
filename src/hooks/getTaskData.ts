import { server } from "@/auth/server";
import { getCurrentKoreanTime } from "@/utils/dateUtils";

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

export const createTask = async (task: TaskFormData) => {
  try {
    const res = await server.post('/task', {
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

export const deleteTask = async (taskId: number) => {
  try {
    const res = await server.delete(`/task/${taskId}`);
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