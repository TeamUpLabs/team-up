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
      
      console.log(`Response status: ${response.status}`);
      console.log(`Response data:`, response.data);
      
      return response.data;
    } catch (err) {
      console.error(`Error fetching data from ${url}:`, err);
      throw err;
    }
  }, [token]);

  // 태스크 데이터 가져오기
  const fetchTasks = useCallback(async (tasksUrl: string) => {
    try {
      const tasksData = await fetchRelatedData<Task[]>(tasksUrl);
      setTasks(tasksData);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }, [fetchRelatedData]);

  // 마일스톤 데이터 가져오기
  const fetchMilestones = useCallback(async (milestonesUrl: string) => {
    try {
      const milestonesData = await fetchRelatedData<MileStone[]>(milestonesUrl);
      setMilestones(milestonesData);
    } catch (err) {
      console.error("Error fetching milestones:", err);
    }
  }, [fetchRelatedData]);

  // 참여 요청 데이터 가져오기
  const fetchParticipationRequests = useCallback(async (participationRequestsUrl: string) => {
    try {
      const participationRequestsData = await fetchRelatedData<ParticipationRequest[]>(participationRequestsUrl);
      setParticipationRequests(participationRequestsData);
    } catch (err) {
      console.error("Error fetching participation requests:", err);
    }
  }, [fetchRelatedData]);

  const fetchChannels = useCallback(async (channelsUrl: string) => {
    try {
      const channelsData = await fetchRelatedData<Channel[]>(channelsUrl);
      setChannels(channelsData);
    } catch (err) {
      console.error("Error fetching channels:", err);
    }
  }, [fetchRelatedData]);

  const fetchSchedules = useCallback(async (schedulesUrl: string) => {
    try {
      const schedulesData = await fetchRelatedData<Schedule[]>(schedulesUrl);
      setSchedules(schedulesData);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    }
  }, [fetchRelatedData]);

  const fetchWhiteboards = useCallback(async (whiteboardsUrl: string) => {
    try {
      const whiteboardsData = await fetchRelatedData<WhiteBoard[]>(whiteboardsUrl);
      setWhiteboards(whiteboardsData);
    } catch (err) {
      console.error("Error fetching whiteboards:", err);
    }
  }, [fetchRelatedData]);

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
    const fetchInitialData = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        const projectData = await fetchRelatedData<Project>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}`);
        setProject(projectData);

        if (projectData.links?.tasks?.href) {
          await fetchTasks(projectData.links.tasks.href);
        }
        if (projectData.links?.milestones?.href) {
          await fetchMilestones(projectData.links.milestones.href);
        }
        if (projectData.links?.participation_requests?.href) {
          await fetchParticipationRequests(projectData.links.participation_requests.href);
        }
        if (projectData.links?.channels?.href) {
          await fetchChannels(projectData.links.channels.href);
        }
        if (projectData.links?.schedules?.href) {
          await fetchSchedules(projectData.links.schedules.href);
        }
        if (projectData.links?.whiteboards?.href) {
          await fetchWhiteboards(projectData.links.whiteboards.href);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load project data'));
        console.error("Error fetching initial project data:", err);
      } finally {
        setIsLoading(false);
      }
    };

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