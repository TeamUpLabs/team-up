"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Project } from "@/types/Project";
import { Task } from "@/types/Task";
import { MileStone } from "@/types/MileStone";
import { ParticipationRequest } from "@/types/ParticipationRequest";
import { Channel } from "@/types/Channel";
import { Schedule } from "@/types/Schedule";
import { WhiteBoard } from "@/types/WhiteBoard";
import { server } from "@/auth/server";
import { useAuthStore } from "@/auth/authStore";
import { AxiosError } from "axios";

type AdditionalData = {
  tasks: Task[];
  milestones: MileStone[];
  participation_requests: ParticipationRequest[];
  channels: Channel[];
  schedules: Schedule[];
  whiteboards: WhiteBoard[];
};

type ProjectContextType = {
  project: Project | null;
  additional_data: AdditionalData;
  isLoading: boolean;
  error: Error | null;
  refetchProject: () => Promise<Project | undefined>;
  refetchAdditionalData: () => Promise<Partial<AdditionalData> | undefined>;
};

const defaultAdditionalData: AdditionalData = {
  tasks: [],
  milestones: [],
  participation_requests: [],
  channels: [],
  schedules: [],
  whiteboards: []
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

const useProjectFetcher = (projectId: string, token: string | null) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProject = useCallback(async (id: string) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await server.get<Project>(`/api/v1/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setProject(response.data);
      return response.data;

    } catch (err) {
      const error = err instanceof AxiosError
        ? new Error(err.response?.data?.message || 'Failed to fetch project')
        : err instanceof Error
          ? err
          : new Error('An unknown error occurred');

      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const refetchProject = useCallback(async (): Promise<Project | undefined> => {
    if (!projectId) return undefined;
    try {
      const result = await fetchProject(projectId);
      return result;
    } catch (error) {
      console.error('Error in refetchProject:', error);
      return undefined;
    }
  }, [fetchProject, projectId]);

  // Initial fetch
  useEffect(() => {
    if (!projectId || !token) return;

    fetchProject(projectId);
  }, [fetchProject, projectId, token]);

  return {
    project,
    isLoading,
    error,
    refetchProject
  };
};

const useAdditionalDataFetcher = (project: Project | null, token: string | null) => {
  const [additionalData, setAdditionalData] = useState<AdditionalData>(defaultAdditionalData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResourceData = useCallback(async (projectData: Project | null) => {
    if (!token || !projectData) {
      console.log('No token or project data available');
      return {};
    }

    type ResourceType = keyof Omit<AdditionalData, 'isLoading' | 'error'>;
    const resourceTypes: ResourceType[] = ["tasks", "milestones", "participation_requests", "channels", "schedules", "whiteboards"];

    try {
      const results = await Promise.allSettled(
        resourceTypes.map(async (resource) => {
          const response = await server.get<Project[ResourceType]>(`/api/v1/projects/${projectData.id}/${resource}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          return { resource, data: response.data };
        })
      );

      const successfulResults = results.reduce((acc, result) => {
        if (result.status === 'fulfilled') {
          const { resource, data } = result.value;
          return { ...acc, [resource]: data };
        }
        return acc;
      }, {} as Partial<AdditionalData>);

      setAdditionalData(prev => ({
        ...prev,
        ...successfulResults
      }));

      return successfulResults;
    } catch (err) {
      const error = err instanceof AxiosError
        ? new Error(err.response?.data?.message || 'Failed to fetch project')
        : err instanceof Error
          ? err
          : new Error('An unknown error occurred');

      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const refetchAdditionalData = useCallback(async (): Promise<Partial<AdditionalData> | undefined> => {
    if (!project) return undefined;

    setIsLoading(true);
    setError(null);

    try {
      const results = await fetchResourceData(project);

      if (results && Object.keys(results).length > 0) {
        setAdditionalData(prev => ({
          ...prev,
          ...results
        } as AdditionalData));
      }

      return results;
    } catch (err) {
      const error = err instanceof Error
        ? err
        : new Error('Failed to refetch additional data');

      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchResourceData, project]);

  // Memoize the fetch function to prevent unnecessary re-renders
  const memoizedFetchResourceData = useCallback((projectData: Project | null) => {
    return fetchResourceData(projectData);
  }, [fetchResourceData]);

  useEffect(() => {
    if (!project?.id) return;
    
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        await memoizedFetchResourceData(project);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error fetching additional data:', error);
        }
      }
    };
    
    fetchData();
    
    return () => {
      controller.abort();
    };
  }, [project, memoizedFetchResourceData, token]);

  return {
    additionalData,
    isLoading,
    error,
    refetchAdditionalData
  };
}

export const ProjectProvider: React.FC<{
  children: React.ReactNode;
  projectId: string
}> = ({ children, projectId }) => {
  const token = useAuthStore(state => state.token);

  const {
    project,
    isLoading: isProjectLoading,
    error: projectError,
    refetchProject
  } = useProjectFetcher(projectId, token);

  const {
    additionalData,
    isLoading: isAdditionalDataLoading,
    error: additionalDataError,
    refetchAdditionalData
  } = useAdditionalDataFetcher(project, token);

  const value = useMemo(() => ({
    project,
    additional_data: additionalData,
    isLoading: isProjectLoading || isAdditionalDataLoading,
    error: projectError || additionalDataError,
    refetchProject,
    refetchAdditionalData
  }) as ProjectContextType, [
    project,
    additionalData,
    isProjectLoading,
    isAdditionalDataLoading,
    projectError,
    additionalDataError,
    refetchProject,
    refetchAdditionalData
  ]);

  // SSE connection setup
  useEffect(() => {
    if (!project?.id || !token) return;

    const sseUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${project.id}/sse`);
    sseUrl.searchParams.append('token', token);
    
    console.log('Setting up SSE connection:', sseUrl.toString());

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimer: NodeJS.Timeout;
    let eventSource: EventSource;

    const setupEventSource = () => {
      eventSource = new EventSource(sseUrl.toString());

      eventSource.onopen = () => {
        console.log('SSE connection opened');
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('SSE message received:', data);

          // Update project data if the ID matches
          if (data.id === project.id) {
            refetchProject();
          }
        } catch (err) {
          console.error('Error parsing SSE message:', err);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        
        if (eventSource.readyState === EventSource.CLOSED) {
          eventSource.close();
          
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff with max 30s
            
            reconnectTimer = setTimeout(() => {
              console.log(`Attempting to reconnect to SSE (attempt ${reconnectAttempts}/${maxReconnectAttempts})...`);
              setupEventSource(); // Recreate the connection
            }, delay);
          } else {
            console.error('Max reconnection attempts reached. Giving up on SSE connection.');
          }
        }
      };
    };

    setupEventSource();

    return () => {
      console.log('Cleaning up SSE connection');
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [project?.id, token, refetchProject]);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
