"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Project } from "@/types/Project";

type ProjectContextType = {
  project: Project | null;
};

const ProjectContext = createContext<ProjectContextType>({ 
  project: null,
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
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!project?.id) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      const newEventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/project/${project.id}/sse`);
      eventSourceRef.current = newEventSource;

      newEventSource.onmessage = (event) => {
        try {
          const updatedProject = JSON.parse(event.data);
          if (updatedProject && updatedProject.id === project.id) {
            setProject(updatedProject);
          }
        } catch (error) {
          console.error("Error parsing project SSE data:", error);
        }
      };

      newEventSource.onerror = (error) => {
        console.error("Project SSE connection error:", error);
        newEventSource.close(); 

        if (eventSourceRef.current === newEventSource) {
            eventSourceRef.current = null; 
            console.log("Attempting to reconnect to project updates stream in 5 seconds...");
            setTimeout(() => {
                if (project?.id) {
                    connect();
                }
            }, 5000);
        }
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [project?.id]);

  return (
    <ProjectContext.Provider value={{ project }}>
      {children}
    </ProjectContext.Provider>
  );
};