"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Project } from "@/types/Project";
import { Task } from "@/types/Task";
import { MileStone } from "@/types/MileStone";
import { ParticipationRequest } from "@/types/ParticipationRequest";
import { Channel } from "@/types/Channel";
import { Schedule } from "@/types/Schedule";
import { WhiteBoard, Comment as WhiteboardComment } from "@/types/WhiteBoard";
import { server } from "@/auth/server";
import { useAuthStore } from "@/auth/authStore";
import { AxiosError } from "axios";

export type AdditionalData = {
  tasks: Task[];
  milestones: MileStone[];
  participation_requests: ParticipationRequest[];
  channels: Channel[];
  schedules: Schedule[];
  whiteboards: WhiteBoard[];
};

export type ProjectContextType = {
  project: Project | null;
  additional_data: AdditionalData;
  isLoading: boolean;
  error: Error | null;
  refetchProject: () => Promise<Project | undefined>;
  refetchAdditionalData: () => Promise<Partial<AdditionalData> | undefined>;
  // Update functions
  updateTaskInContext: (updatedTask: Task) => void;
  addTaskInContext: (newTask: Task) => void;
  deleteTaskInContext: (milestone_id: number, task_id: number) => void;
  // Add similar functions for other data types as needed
  updateMilestoneInContext: (updatedMilestone: MileStone) => void;
  addMilestoneInContext: (newMilestone: MileStone) => void;
  deleteMilestoneInContext: (milestoneId: number) => void;

  // Schedule functions
  addScheduleInContext: (newSchedule: Schedule) => void;
  updateScheduleInContext: (updatedSchedule: Schedule) => void;
  deleteScheduleInContext: (scheduleId: number) => void;

  // WhiteBoard functions
  addWhiteBoardInContext: (newWhiteBoard: WhiteBoard) => void;
  updateWhiteBoardInContext: (updatedWhiteBoard: WhiteBoard) => void;
  updateWhiteBoardCommentInContext: (whiteboard_id: number, updatedComment: WhiteboardComment) => void;
  deleteWhiteBoardInContext: (whiteboardId: number) => void;
};

const defaultAdditionalData: AdditionalData = {
  tasks: [],
  milestones: [],
  participation_requests: [],
  channels: [],
  schedules: [],
  whiteboards: []
};

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

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

const useAdditionalDataFetcher = (project: Project | null, token: string | null, setAdditionalData: React.Dispatch<React.SetStateAction<AdditionalData>>) => {
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
  }, [token, setAdditionalData]);

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
  }, [fetchResourceData, project, setAdditionalData]);

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
  const [additionalData, setAdditionalData] = useState<AdditionalData>(defaultAdditionalData);

  const {
    project,
    isLoading: isProjectLoading,
    error: projectError,
    refetchProject
  } = useProjectFetcher(projectId, token);

  const {
    isLoading: isAdditionalDataLoading,
    error: additionalDataError,
    refetchAdditionalData
  } = useAdditionalDataFetcher(project, token, setAdditionalData);

  // Update functions
  const updateTaskInContext = useCallback((updatedTask: Task) => {
    setAdditionalData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    }));
  }, []);

  const addTaskInContext = useCallback((newTask: Task) => {
    setAdditionalData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      milestones: prev.milestones.map(milestone => 
        milestone.id === newTask.milestone_id ? {...milestone, tasks: [...milestone.tasks, newTask]} : milestone
      )
    }));
  }, []);

  const deleteTaskInContext = useCallback((milestone_id: number, task_id: number) => {
    setAdditionalData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== task_id),
      milestones: prev.milestones.map(milestone => 
        milestone.id === milestone_id ? {...milestone, tasks: [...milestone.tasks.filter(task => task.id !== task_id)]} : milestone
      )
    }));
  }, []);

  const updateMilestoneInContext = useCallback((updatedMilestone: MileStone) => {
    setAdditionalData(prev => ({
      ...prev,
      milestones: prev.milestones.map(milestone => 
        milestone.id === updatedMilestone.id ? updatedMilestone : milestone
      )
    }));
  }, []);

  const addMilestoneInContext = useCallback((newMilestone: MileStone) => {
    setAdditionalData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  }, []);

  const deleteMilestoneInContext = useCallback((milestoneId: number) => {
    setAdditionalData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== milestoneId)
    }));
  }, []);

  const updateScheduleInContext = useCallback((updatedSchedule: Schedule) => {
    setAdditionalData(prev => ({
      ...prev,
      schedules: prev.schedules.map(schedule => 
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule
      )
    }));
  }, []);

  const addScheduleInContext = useCallback((newSchedule: Schedule) => {
    setAdditionalData(prev => ({
      ...prev,
      schedules: [...prev.schedules, newSchedule]
    }));
  }, []);

  const deleteScheduleInContext = useCallback((scheduleId: number) => {
    setAdditionalData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(schedule => schedule.id !== scheduleId)
    }));
  }, []);

  const updateWhiteBoardInContext = useCallback((updatedWhiteBoard: WhiteBoard) => {
    setAdditionalData(prev => ({
      ...prev,
      whiteboards: prev.whiteboards.map(whiteboard => 
        whiteboard.id === updatedWhiteBoard.id ? updatedWhiteBoard : whiteboard
      )
    }));
  }, []);

  const updateWhiteBoardCommentInContext = useCallback((whiteboard_id: number, updatedComment: WhiteboardComment) => {
    setAdditionalData(prev => ({
      ...prev,
      whiteboards: prev.whiteboards.map(whiteboard => {
        if (whiteboard.id === whiteboard_id) {
          const commentExists = whiteboard.reactions.comments.comments.some(
            comment => comment.id === updatedComment.id
          );
          
          let updatedComments;
          if (commentExists) {
            updatedComments = whiteboard.reactions.comments.comments.map(comment => 
              comment.id === updatedComment.id ? updatedComment : comment
            );
          } else {
            updatedComments = [...whiteboard.reactions.comments.comments, updatedComment];
          }
          
          return {
            ...whiteboard,
            reactions: {
              ...whiteboard.reactions,
              comments: {
                count: updatedComments.length,
                comments: updatedComments
              }
            }
          };
        }
        return whiteboard;
      })
    }));
  }, []);

  const addWhiteBoardInContext = useCallback((newWhiteBoard: WhiteBoard) => {
    setAdditionalData(prev => ({
      ...prev,
      whiteboards: [...prev.whiteboards, newWhiteBoard]
    }));
  }, []);

  const deleteWhiteBoardInContext = useCallback((whiteboardId: number) => {
    setAdditionalData(prev => ({
      ...prev,
      whiteboards: prev.whiteboards.filter(whiteboard => whiteboard.id !== whiteboardId)
    }));
  }, []);

  const value = useMemo(() => ({
    project,
    additional_data: additionalData,
    isLoading: isProjectLoading || isAdditionalDataLoading,
    error: projectError || additionalDataError,
    refetchProject,
    refetchAdditionalData,
    // Update functions
    updateTaskInContext,
    addTaskInContext,
    deleteTaskInContext,
    updateMilestoneInContext,
    addMilestoneInContext,
    deleteMilestoneInContext,
    updateScheduleInContext,
    addScheduleInContext,
    deleteScheduleInContext,
    updateWhiteBoardInContext,
    updateWhiteBoardCommentInContext,
    addWhiteBoardInContext,
    deleteWhiteBoardInContext,
  }) as ProjectContextType, [
    project,
    additionalData,
    isProjectLoading,
    isAdditionalDataLoading,
    projectError,
    additionalDataError,
    refetchProject,
    refetchAdditionalData,
    updateTaskInContext,
    addTaskInContext,
    deleteTaskInContext,
    updateMilestoneInContext,
    addMilestoneInContext,
    deleteMilestoneInContext,
    updateScheduleInContext,
    addScheduleInContext,
    deleteScheduleInContext,
    updateWhiteBoardInContext,
    updateWhiteBoardCommentInContext,
    addWhiteBoardInContext,
    deleteWhiteBoardInContext,
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
