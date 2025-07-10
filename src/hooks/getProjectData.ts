import { server } from "@/auth/server";
import { getCurrentKoreanTime, getCurrentKoreanTimeDate } from "@/utils/dateUtils";
import { useAuthStore } from "@/auth/authStore";

export const getAllProjects = async () => {
  try {
    const res = await server.get(`/projects`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch project data");
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
    throw error;
  }
};

export const getProjectsByUser = async () => {
  try {
    const token = useAuthStore.getState().token;
    const user = useAuthStore.getState().user;
    const res = await server.get(`/users/${user?.id}/projects`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch project data");
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
    throw error;
  }
};

export const getProjectsByUserId = async (user_id: number) => {
  try {
    const res = await server.get(`/users/${user_id}/projects`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch project data");
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
    throw error;
  }
}

export const getProjectById = async (project_id: string) => {
  try {
    const res = await server.get(`/projects/${project_id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch project data");
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
    throw error;
  }
};


export const getAllProjectsExceptMyProject = async (member_id: number) => {
  try {
    const res = await server.get(`/projects/exclude/${member_id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch project data");
    }
  } catch (error) {
    console.error("Error fetching filtered project data:", error);
    throw error;
  }
};

export const getMemberByProject = async (project_id: string) => {
  try {
    const res = await server.get(`/projects/${project_id}/members`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch project data");
    }
  } catch (error) {
    console.error("Error fetching filtered project data:", error);
    throw error;
  }
}

interface ProjectFormData {
  title: string;
  description: string;
  leader_id: number;
  projectType: string;
  roles: string[];
  techStack: string[];
  location: string;
  teamSize: number;
  startDate: string;
  endDate: string;
}

export const generateProjectId = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  const res = await server.get(`/projects/ids`);
  const data = res.data;
  if (data.includes(result)) {
    return generateProjectId();
  }
  
  return result;
}; 

export const createProject = async (formData: ProjectFormData) => {
  try {
    const projectId = await generateProjectId();

    const res = await server.post('/projects', {
      id: projectId,
      title: formData.title,
      description: formData.description,
      status: "모집중",
      leader_id: formData.leader_id,
      projectType: formData.projectType,
      roles: formData.roles,
      techStack: formData.techStack,
      location: formData.location,
      teamSize: Number(formData.teamSize),
      startDate: formData.startDate,
      endDate: formData.endDate,
      createdAt: getCurrentKoreanTimeDate(),
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      return projectId;
    } else {
      throw new Error("Failed to create project");
    }
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const deleteProject = async (project_id: string) => {
  try {
    const res = await server.delete(`/projects/${project_id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to delete project");
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

interface UpdateProjectFormData {
  title: string;
  description: string;
  status: string;
  visibility: string;
  tags: string[];
  start_date: string;
  end_date: string;
  team_size: number;
  location: string;
  project_type: string;
}



export const updateProject = async (project_id: string, formData: UpdateProjectFormData) => {
  try {
    const res = await server.put(`/projects/${project_id}`, {
      title: formData.title,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      team_size: Number(formData.team_size),
      location: formData.location,
      project_type: formData.project_type,
      status: formData.status,
      visibility: formData.visibility,
      tags: formData.tags,
    }, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update project");
    }
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const updateProjectMemberPermission = async (project_id: string, member_id: number, permission: string) => {
  try {
    const res = await server.put(`/projects/${project_id}/member/${member_id}?permission=${permission}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to update project member permission");
    }
  } catch (error) {
    console.error("Error updating project member permission:", error);
    throw error;
  }
}

export const allowParticipationRequest = async (request_id: number) => {
  try {
    const res = await server.put(`/participation-requests/${request_id}`, {
      status: "accepted",
      processed_at: getCurrentKoreanTime(),
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to allow participation request");
    }
  } catch (error) {
    console.error("Error allowing participation request:", error);
    throw error;
  }
}

export const rejectParticipationRequest = async (request_id: number) => {
  try {
    const res = await server.put(`/participation-requests/${request_id}`, {
      status: "rejected",
      processed_at: getCurrentKoreanTime(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to reject participation request");
    }
  } catch (error) {
    console.error("Error rejecting participation request:", error);
    throw error;
  }
}

export const kickOutMemberFromProject = async (project_id: string, member_id: number) => {
  try {
    const res = await server.put(`/projects/${project_id}/member/${member_id}/kick`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to kick out member from project");
    }
  } catch (error) {
    console.error("Error kicking out member from project:", error);
    throw error;
  }
}