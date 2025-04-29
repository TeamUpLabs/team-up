"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Project } from "@/types/Project";
import { server } from "@/auth/server";

type ProjectContextType = {
  project: Project | null;
  refreshProject: () => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType>({ 
  project: null,
  refreshProject: async () => {} 
});

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({
  children,
  project: initialProject
}: {
  children: React.ReactNode;
  project: Project;
}) => {
  const [project, setProject] = useState<Project>(initialProject);

  const refreshProject = useCallback(async () => {
    try {
      // Fetch the latest project data from the API
      const response = await server.get(`/project/${project.id}`);
      if (response.status !== 200) throw new Error('Failed to refresh project data');
      const updatedProject = response.data;
      setProject(updatedProject);
    } catch (error) {
      console.error('Error refreshing project data:', error);
    }
  }, [project.id]);

  return (
    <ProjectContext.Provider value={{ project, refreshProject }}>
      {children}
    </ProjectContext.Provider>
  );
};