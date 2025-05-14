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

  // const refreshProject = useCallback(async () => {
  //   try {
  //     // Fetch the latest project data from the API
  //     const response = await server.get(`/project/${project.id}`);
  //     if (response.status !== 200) throw new Error('Failed to refresh project data');
  //     const updatedProject = response.data;
  //     setProject(updatedProject);
  //   } catch (error) {
  //     console.error('Error refreshing project data:', error);
  //   }
  // }, [project.id]);

  // Setup SSE connection for real-time project updates
  useEffect(() => {
    if (!project?.id) return;
    
    // Close any existing connection before creating a new one
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Create new SSE connection
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/project/${project.id}/sse`);
    eventSourceRef.current = eventSource;
    
    eventSource.onmessage = (event) => {
      try {
        const updatedProject = JSON.parse(event.data);
        if (updatedProject && updatedProject.id === project.id) {
          setProject(updatedProject);
        }
      } catch (error) {
        console.error("Error parsing project SSE data:", error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error("Project SSE connection error:", error);
      eventSource.close();
      
      // Try to reconnect after delay
      setTimeout(() => {
        console.log("Attempting to reconnect to project updates stream...");
        if (eventSourceRef.current === eventSource) {
          eventSourceRef.current = null;
        }
      }, 5000);
    };
    
    return () => {
      eventSource.close();
      if (eventSourceRef.current === eventSource) {
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