import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Mentor, MentorExtended } from "@/types/mentoring/Mentor";
import useSWR from "swr";
import { fetcher } from "@/auth/server";
import useAuthHydration from "@/hooks/useAuthHydration";
import { useAuthStore } from "@/auth/authStore";

interface MentoringContextType {
  mentors: MentorExtended[];  
  isLoading: boolean;
  error: Error | null;
  refetchMentors: () => Promise<MentorExtended[] | undefined>;
  addMentor: (mentor: Mentor) => Promise<void>;
  updateMentor: (mentor: Mentor) => Promise<void>;
  deleteMentor: (mentorId: number) => Promise<void>;
}

const MentoringContext = createContext<MentoringContextType | undefined>(undefined);

export const MentoringProvider = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthHydration();
  const [localMentors, setLocalMentors] = useState<MentorExtended[]>([]);
  const [isExtending, setIsExtending] = useState(false);
  
  const { data, error, isLoading, mutate } = useSWR<Mentor[]>(
    hydrated && user?.id ? '/api/v1/mentors/all' : null,
    (url: string) => fetcher(url)
  );

  // Fetch extended data whenever base data changes
  useEffect(() => {
    const extendMentors = async () => {
      if (!data || data.length === 0) {
        setLocalMentors([]);
        return;
      }

      setIsExtending(true);
      try {
        const extendedMentors = await Promise.all(
          data.map(async (mentor) => {
            try {
              const [reviews, sessions] = await Promise.all([
                mentor.links.reviews.href 
                  ? fetcher(mentor.links.reviews.href).catch(() => [])
                  : Promise.resolve([]),
                mentor.links.sessions.href 
                  ? fetcher(mentor.links.sessions.href).catch(() => [])
                  : Promise.resolve([])
              ]);
              
              return {
                ...mentor,
                reviews: reviews || [],
                sessions: sessions || []
              } as MentorExtended;
            } catch (err) {
              console.error('Failed to fetch mentor links:', err);
              return {
                ...mentor,
                reviews: [],
                sessions: []
              } as MentorExtended;
            }
          })
        );
        
        setLocalMentors(extendedMentors);
      } finally {
        setIsExtending(false);
      }
    };

    extendMentors();
  }, [data]);

  const refetchMentors = async (): Promise<MentorExtended[] | undefined> => {
    const result = await mutate();
    if (result) {
      // Fetch reviews and sessions for each mentor
      const extendedMentors = await Promise.all(
        result.map(async (mentor) => {
          try {
            const [reviews, sessions] = await Promise.all([
              mentor.links.reviews.href 
                ? fetcher(mentor.links.reviews.href).catch(() => [])
                : Promise.resolve([]),
              mentor.links.sessions.href 
                ? fetcher(mentor.links.sessions.href).catch(() => [])
                : Promise.resolve([])
            ]);
            
            return {
              ...mentor,
              reviews: reviews || [],
              sessions: sessions || []
            } as MentorExtended;
          } catch (err) {
            console.error('Failed to fetch mentor links:', err);
            return {
              ...mentor,
              reviews: [],
              sessions: []
            } as MentorExtended;
          }
        })
      );
      
      setLocalMentors(extendedMentors);
      return extendedMentors;
    }
    return undefined;
  };

  const addMentor = async (mentor: Mentor): Promise<void> => {
    try {
      // Fetch links for the new mentor
      const [reviews, sessions] = await Promise.all([
        mentor.links.reviews.href 
          ? fetcher(mentor.links.reviews.href).catch(() => [])
          : Promise.resolve([]),
        mentor.links.sessions.href 
          ? fetcher(mentor.links.sessions.href).catch(() => [])
          : Promise.resolve([])
      ]);
      
      const extendedMentor: MentorExtended = {
        ...mentor,
        reviews: reviews || [],
        sessions: sessions || []
      };
      
      // Optimistic update
      const updatedMentors = [...localMentors, extendedMentor];
      setLocalMentors(updatedMentors);
      mutate(updatedMentors, false);
      
      // Revalidate
      await mutate();
    } catch (err) {
      console.error('Failed to add mentor:', err);
      // Rollback on error
      await mutate();
      throw err;
    }
  };

  const updateMentor = async (mentor: Mentor): Promise<void> => {
    try {
      // Fetch links for the updated mentor
      const [reviews, sessions] = await Promise.all([
        mentor.links.reviews.href 
          ? fetcher(mentor.links.reviews.href).catch(() => [])
          : Promise.resolve([]),
        mentor.links.sessions.href 
          ? fetcher(mentor.links.sessions.href).catch(() => [])
          : Promise.resolve([])
      ]);
      
      const extendedMentor: MentorExtended = {
        ...mentor,
        reviews: reviews || [],
        sessions: sessions || []
      };
      
      // Optimistic update
      const updatedMentors = localMentors.map(m => 
        m.user.id === mentor.user.id ? extendedMentor : m
      );
      setLocalMentors(updatedMentors);
      mutate(updatedMentors, false);
      
      // Revalidate
      await mutate();
    } catch (err) {
      console.error('Failed to update mentor:', err);
      // Rollback on error
      await mutate();
      throw err;
    }
  };

  const deleteMentor = async (mentorId: number): Promise<void> => {
    try {
      // Optimistic update
      const updatedMentors = localMentors.filter(m => m.user.id !== mentorId);
      setLocalMentors(updatedMentors);
      mutate(updatedMentors, false);
      
      // Revalidate
      await mutate();
    } catch (err) {
      console.error('Failed to delete mentor:', err);
      // Rollback on error
      await mutate();
      throw err;
    }
  };

  return (
    <MentoringContext.Provider
      value={{
        mentors: localMentors,
        isLoading: isLoading || isExtending,
        error: error || null,
        refetchMentors,
        addMentor,
        updateMentor,
        deleteMentor,
      }}
    >
      {children}
    </MentoringContext.Provider>
  );
};

export const useMentoring = (): MentoringContextType => {
  const context = useContext(MentoringContext);
  if (context === undefined) {
    throw new Error('useMentoring must be used within a MentoringProvider');
  }
  return context;
};