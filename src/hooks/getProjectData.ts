import { server } from "@/auth/server";
import { getCurrentKoreanTimeDate } from "@/utils/dateUtils";
import { useAuthStore } from "@/auth/authStore";

export const getAllProjects = async () => {
  try {
    const res = await server.get(`/project`, {
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

export const getProjectById = async (project_id: string) => {
  try {
    const res = await server.get(`/project/${project_id}`, {
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
    const res = await server.get(`/project/exclude/${member_id}`, {
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
    const res = await server.get(`/project/${project_id}/member`, {
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

  const res = await server.get(`/project/id`);
  const data = res.data;
  if (data.includes(result)) {
    return generateProjectId();
  }
  
  return result;
}; 

export const createProject = async (formData: ProjectFormData) => {
  try {
    const projectId = await generateProjectId();

    const res = await server.post('/project', {
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
    const res = await server.delete(`/project/${project_id}`, {
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
  techStack: string[];
  roles: string[];
  startDate: string;
  endDate: string;
  teamSize: number;
  location: string;
  projectType: string;
  status: string;
}



export const updateProject = async (project_id: string, formData: UpdateProjectFormData) => {
  try {
    const res = await server.put(`/project/${project_id}`, {
      title: formData.title,
      description: formData.description,
      techStack: formData.techStack,
      roles: formData.roles,
      startDate: formData.startDate,
      endDate: formData.endDate,
      teamSize: Number(formData.teamSize),
      location: formData.location,
      projectType: formData.projectType,
      status: formData.status,
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
    const res = await server.put(`/project/${project_id}/member/${member_id}/permission`, {
      permission: permission,
    }, {
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

export const allowParticipationRequest = async (project_id: string, member_id: number) => {
  try {
    const res = await server.put(`/project/${project_id}/participationRequest/${member_id}/allow`, {
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

export const rejectParticipationRequest = async (project_id: string, member_id: number) => {
  try {
    const res = await server.put(`/project/${project_id}/participationRequest/${member_id}/reject`, {
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
    const res = await server.put(`/project/${project_id}/member/${member_id}/kick`, {
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