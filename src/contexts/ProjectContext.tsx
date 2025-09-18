import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { Project } from "@/types/Project";
import { Task } from "@/types/Task";
import { MileStone } from "@/types/MileStone";
import { ParticipationRequest } from "@/types/ParticipationRequest";
import { Channel } from "@/types/Channel";
import { Schedule } from "@/types/Schedule";
import { WhiteBoard } from "@/types/WhiteBoard";
import { server } from "@/auth/server";
import { useAuthStore } from "@/auth/authStore";

type ProjectContextType = {
  project: Project | null;
  tasks: Task[];
  milestones: MileStone[];
  participation_requests: ParticipationRequest[];
  channels: Channel[];
  schedules: Schedule[];
  whiteboards: WhiteBoard[];
  isLoading: boolean;
  error: Error | null;
  fetchRelatedData: <T>(url: string) => Promise<T>;
};

const ProjectContext = createContext<ProjectContextType>({
  project: null,
  tasks: [],
  milestones: [],
  participation_requests: [],
  channels: [],
  schedules: [],
  whiteboards: [],
  isLoading: true,
  error: null,
  fetchRelatedData: async <T,>(): Promise<T> => { throw new Error('fetchRelatedData must be used within a ProjectProvider'); },
});

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider: React.FC<{ children: React.ReactNode; projectId: string }> = ({ children, projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<MileStone[]>([]);
  const [participation_requests, setParticipationRequests] = useState<ParticipationRequest[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [whiteboards, setWhiteboards] = useState<WhiteBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const token = useAuthStore.getState().token

  // 연관 데이터 가져오기
  const fetchRelatedData = useCallback(async <T,>(url: string): Promise<T> => {
    try {
      console.log(`Fetching data from: ${url}`);
      
      // URL에서 경로만 추출 (baseURL 제외)
      const urlPath = url.replace(process.env.NEXT_PUBLIC_API_URL || '', '');
      
      const response = await server.get(urlPath, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      
      // Check if response is successful
      if (response.status >= 200 && response.status < 300) {
        // Handle different response structures
        if (response.data && typeof response.data === 'object') {
          // If the response has a 'data' field, use that (common in REST APIs)
          if ('data' in response.data) {
            console.log('Response data (with data wrapper):', response.data);
            return response.data.data as T;
          }
          // If the response has a 'result' field, use that
          if ('result' in response.data) {
            console.log('Response data (with result wrapper):', response.data);
            return response.data.result as T;
          }
          // Otherwise use the entire response
          console.log('Response data (direct):', response.data);
          return response.data as T;
        }
        return response.data as T;
      } else {
        throw new Error(`API request failed with status ${response.status}`);
      }
    } catch (err) {
      console.error(`Error fetching data from ${url}:`, err);
      throw err;
    }
  }, [token]);

  // 태스크 데이터 가져오기
  const fetchTasks = useCallback(async (tasksUrl?: string) => {
    const url = tasksUrl || `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}/tasks`;
    try {
      console.log('Fetching tasks from:', url);
      const tasksData = await fetchRelatedData<Task[]>(url);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      return tasksData;
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
      throw err;
    }
  }, [fetchRelatedData, projectId]);

  // 마일스톤 데이터 가져오기
  const fetchMilestones = useCallback(async (milestonesUrl?: string) => {
    const url = milestonesUrl || `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}/milestones`;
    try {
      console.log('Fetching milestones from:', url);
      const milestonesData = await fetchRelatedData<MileStone[]>(url);
      setMilestones(Array.isArray(milestonesData) ? milestonesData : []);
      return milestonesData;
    } catch (err) {
      console.error("Error fetching milestones:", err);
      setMilestones([]);
      throw err;
    }
  }, [fetchRelatedData, projectId]);

  // 참여 요청 데이터 가져오기
  const fetchParticipationRequests = useCallback(async (participationRequestsUrl?: string) => {
    const url = participationRequestsUrl || `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}/participation_requests`;
    try {
      console.log('Fetching participation requests from:', url);
      const data = await fetchRelatedData<ParticipationRequest[]>(url);
      setParticipationRequests(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error("Error fetching participation requests:", err);
      setParticipationRequests([]);
      throw err;
    }
  }, [fetchRelatedData, projectId]);

  const fetchChannels = useCallback(async (channelsUrl?: string) => {
    const url = channelsUrl || `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}/channels`;
    try {
      console.log('Fetching channels from:', url);
      const data = await fetchRelatedData<Channel[]>(url);
      setChannels(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error("Error fetching channels:", err);
      setChannels([]);
      throw err;
    }
  }, [fetchRelatedData, projectId]);

  const fetchSchedules = useCallback(async (schedulesUrl?: string) => {
    const url = schedulesUrl || `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}/schedules`;
    try {
      console.log('Fetching schedules from:', url);
      const data = await fetchRelatedData<Schedule[]>(url);
      setSchedules(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setSchedules([]);
      throw err;
    }
  }, [fetchRelatedData, projectId]);

  const fetchWhiteboards = useCallback(async (whiteboardsUrl?: string) => {
    const url = whiteboardsUrl || `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}/whiteboards`;
    try {
      console.log('Fetching whiteboards from:', url);
      const data = await fetchRelatedData<WhiteBoard[]>(url);
      setWhiteboards(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error("Error fetching whiteboards:", err);
      setWhiteboards([]);
      throw err;
    }
  }, [fetchRelatedData, projectId]);

  // 프로젝트 SSE 연결
  useEffect(() => {
    if (!projectId) return;

    const connect = () => {
      const sseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}/sse`;
      const newEventSource = new EventSource(sseUrl);

      newEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as Project;
          setProject(prev => ({ ...prev, ...data }));

          if (data.links) {
            // 연관 데이터가 있는 경우 가져오기
            if (data.links?.tasks?.href) {
              fetchTasks(data.links.tasks.href);
            }
            if (data.links?.milestones?.href) {
              fetchMilestones(data.links.milestones.href);
            }
            if (data.links?.participation_requests?.href) {
              fetchParticipationRequests(data.links.participation_requests.href);
            }
            if (data.links?.channels?.href) {
              fetchChannels(data.links.channels.href);
            }
            if (data.links?.schedules?.href) {
              fetchSchedules(data.links.schedules.href);
            }
            if (data.links?.whiteboards?.href) {
              fetchWhiteboards(data.links.whiteboards.href);
            }
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
          console.log("Attempting to reconnect in 5 seconds...");
          setTimeout(() => {
            if (projectId) {
              connect();
            }
          }, 5000);
        }
      };

      eventSourceRef.current = newEventSource;
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [projectId, fetchTasks, fetchMilestones, fetchParticipationRequests, fetchChannels, fetchSchedules, fetchWhiteboards]);

  // 초기 프로젝트 데이터 가져오기
  useEffect(() => {
    // Define a type-safe safeFetch function inside the effect
    const safeFetch = async <T extends unknown[]>(url: string, setData: (data: T) => void, dataName: string): Promise<T | null> => {
      try {
        console.log(`Fetching ${dataName}...`);
        const data = await fetchRelatedData<T>(url);
        console.log(`Fetched ${dataName}:`, data);
        const result = (Array.isArray(data) ? data : []) as unknown as T;
        setData(result);
        return result;
      } catch (err) {
        console.error(`Error fetching ${dataName}:`, err);
        setData([] as unknown as T);
        return null;
      }
    };
    const fetchInitialData = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      
      try {
        console.log('Fetching project data...');
        const projectData = await fetchRelatedData<Project>(`${baseUrl}/api/v1/projects/${projectId}`);
        console.log('Project data:', projectData);
        setProject(projectData);

        // Create an array of fetch promises for all related data
        const fetchPromises = [
          safeFetch<Task[]>(
            `${baseUrl}/api/v1/projects/${projectId}/tasks`, 
            setTasks, 
            'tasks'
          ),
          safeFetch<MileStone[]>(
            `${baseUrl}/api/v1/projects/${projectId}/milestones`, 
            setMilestones, 
            'milestones'
          ),
          safeFetch<ParticipationRequest[]>(
            `${baseUrl}/api/v1/projects/${projectId}/participation_requests`, 
            setParticipationRequests, 
            'participation requests'
          ),
          safeFetch<Channel[]>(
            `${baseUrl}/api/v1/projects/${projectId}/channels`, 
            setChannels, 
            'channels'
          ),
          safeFetch<Schedule[]>(
            `${baseUrl}/api/v1/projects/${projectId}/schedules`, 
            setSchedules, 
            'schedules'
          ),
          safeFetch<WhiteBoard[]>(
            `${baseUrl}/api/v1/projects/${projectId}/whiteboards`, 
            setWhiteboards, 
            'whiteboards'
          )
        ];
        
        // Wait for all fetches to complete
        await Promise.all(fetchPromises);
        console.log('All related data fetched successfully');
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load project data');
        console.error("Error in fetchInitialData:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add debug logging for environment variables
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('Project ID:', projectId);
    
    fetchInitialData();
  }, [projectId, fetchRelatedData, fetchTasks, fetchMilestones, fetchParticipationRequests, fetchChannels, fetchSchedules, fetchWhiteboards]);

  return (
    <ProjectContext.Provider value={{ 
      project, 
      tasks, 
      milestones, 
      participation_requests,
      channels,
      schedules,
      whiteboards,
      isLoading, 
      error,
      fetchRelatedData 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};