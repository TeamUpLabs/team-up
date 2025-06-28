"use client";

import { useProject } from '@/contexts/ProjectContext';
import ActiveMilestoneCard from "@/components/project/dashboard/ActiveMilestoneCard";
import ActiveTaskCard from "@/components/project/dashboard/ActiveTaskCard";
import TeamCard from "@/components/project/dashboard/TeamCard";
import CompletionRateCard from "@/components/project/dashboard/CompletionRateCard";
import RecentActivity from "@/components/project/dashboard/RecentActivity";
import TeamPerformance from "@/components/project/dashboard/TeamPerformance";
import WeeklyChart from "@/components/project/dashboard/WeeklyChart";
import QuickAction from "@/components/project/dashboard/QuickAction";
import UpcommingDeadline from "@/components/project/dashboard/UpcommingDeadline";

export default function ProjectPage() {
  const { project, isLoading } = useProject();
  
  // Provide default empty values when project is loading
  const projectData = project || {
    id: '',
    title: '', // Changed from name to title to match interface
    status: 'in_progress',
    description: '',
    leader: {
      id: 0,
      name: '',
      email: '',
      role: '',
      currentTask: [],
      status: '',
      lastLogin: '',
      createdAt: '',
      updatedAt: '',
      skills: [],
      projects: [],
      projectDetails: [],
      profileImage: '',
      contactNumber: '',
      birthDate: '',
      introduction: '',
      workingHours: {
        start: '',
        end: '',
        timezone: ''
      },
      languages: [],
      socialLinks: [],
      participationRequests: [],
      notification: [],
      isGithub: false,
      github_id: '',
      github_access_token: '',
      isGoogle: false,
      google_id: '',
      google_access_token: '',
      isApple: false,
      apple_id: '',
      apple_access_token: '',
      signupMethod: 'local' as const
    },
    manager: [],
    roles: [],
    techStack: [],
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    teamSize: 0,
    location: '',
    projectType: '',
    members: [],
    tasks: [],
    milestones: [],
    participationRequest: [],
    participationRequestMembers: [],
    schedules: [],
    channels: [],
    github_repo_url: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActiveMilestoneCard 
          activeMilestoneCount={projectData?.milestones?.filter((milestone) => milestone.status !== "done").length || 0}
          isLoading={isLoading}
        />
        <ActiveTaskCard 
          activeTaskCount={projectData?.tasks?.filter((task) => task.status !== "done").length || 0}
        />
        <TeamCard 
          TotalMemberCount={projectData?.members?.length || 0} 
          ActiveMemberCount={projectData?.members?.filter((member) => member.status !== "done").length || 0}
          isLoading={isLoading}
        />
        <CompletionRateCard 
          project={projectData} 
          isLoading={isLoading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TeamPerformance 
          project={projectData} 
          className="md:col-span-2" 
          isLoading={isLoading}
        />
        <WeeklyChart 
          tasks={projectData?.tasks || []} 
          milestones={projectData?.milestones || []} 
          schedules={projectData?.schedules || []}
        />
        <QuickAction />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <RecentActivity 
          project={projectData} 
          isLoading={isLoading}
        />
        <UpcommingDeadline 
          project={projectData} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}