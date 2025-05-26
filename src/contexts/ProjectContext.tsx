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

  // Setup SSE connection for real-time project updates
  useEffect(() => {
    if (!project?.id) {
      // If there's an existing connection, close it when the project is not available
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const connect = () => {
      // Close any existing connection before creating a new one
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create new SSE connection
      const newEventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/project/${project.id}/sse`);
      eventSourceRef.current = newEventSource;

      newEventSource.onmessage = (event) => {
        try {
          const updatedProject = JSON.parse(event.data);
          // Check if the project ID from SSE matches the current project ID
          // This is important because the project context might have changed
          // while the SSE connection was being established or during reconnection attempts.
          if (updatedProject && updatedProject.id === project.id) {
            setProject(updatedProject);
          }
        } catch (error) {
          console.error("Error parsing project SSE data:", error);
        }
      };

      newEventSource.onerror = (error) => {
        console.error("Project SSE connection error:", error);
        newEventSource.close(); // Close the failed connection

        // Attempt to reconnect only if the current eventSource is the one that failed
        if (eventSourceRef.current === newEventSource) {
            eventSourceRef.current = null; // Clear the ref before attempting to reconnect
            console.log("Attempting to reconnect to project updates stream in 5 seconds...");
            setTimeout(() => {
                // Before reconnecting, ensure the project ID is still valid
                // as the component might have unmounted or project changed.
                if (project?.id) {
                    connect();
                }
            }, 5000);
        }
      };
    };

    connect(); // Initial connection

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