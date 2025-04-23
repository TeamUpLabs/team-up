import { server } from "@/auth/server";
import { getCurrentKoreanTimeDate } from "@/utils/dateUtils";

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

export const getProjectByMemberId = async (member_id: number) => {
  try {
    const res = await server.get(`/member/${member_id}/project`, {
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
      startDate: getCurrentKoreanTimeDate(),
      endDate: formData.endDate,
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
