"use client";

import { createContext, useContext } from "react";
import { Project } from "@/types/Project";

type ProjectContextType = {
  project: Project | null;
};

const ProjectContext = createContext<ProjectContextType>({ project: null });

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({
  children,
  project
}: {
  children: React.ReactNode;
  project: Project;
}) => {
  return (
    <ProjectContext.Provider value={{ project }}>
      {children}
    </ProjectContext.Provider>
  );
};