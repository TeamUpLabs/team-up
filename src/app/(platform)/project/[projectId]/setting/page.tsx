"use client";

import { useAuthStore } from "@/auth/authStore";
import { useProject } from "@/contexts/ProjectContext";
import { useState } from "react";
import GeneralSettingTab from "@/components/project/setting/GeneralSettingTab";
import TeamSettingTab from "@/components/project/setting/TeamSettingTab";
import DangerSettingTab from "@/components/project/setting/DangerSettingTab";
import { ParticipationRequest } from "@/types/ParticipationRequest";

export default function SettingsPage() {
  const { project, additional_data } = useProject();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("general");

  const isLeader = project?.members.some((member) => member.user.id === user?.id && member.role === "leader") || project?.owner.id === user?.id;
    
  // 참여 요청이 있는지 확인
  const hasParticipationRequests = additional_data?.participation_requests && additional_data.participation_requests.filter((request: ParticipationRequest) => request.status === "pending").length > 0;

  return (
    <div className="">
      <div className="flex items-center justify-between mb-8 bg-project-page-title-background border border-project-page-title-border p-6 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">설정</h1>
          <p className="text-text-secondary mt-2">프로젝트의 설정을 관리하세요.</p>
        </div>
      </div>

      <div className="flex border-b border-component-border mb-6">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 font-medium cursor-pointer ${
            activeTab === "general" ? "text-blue-500 border-b-2 border-blue-500" : "text-text-secondary"
          }`}
        >
          일반
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2 font-medium cursor-pointer relative ${
            activeTab === "team" ? "text-blue-500 border-b-2 border-blue-500" : "text-text-secondary"
          }`}
        >
          팀 관리
          {hasParticipationRequests && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-100"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center">
                {additional_data.participation_requests.filter((request: ParticipationRequest) => request.status === "pending").length}
              </span>
            </span>
          )}
        </button>
        {isLeader && (
          <button
            onClick={() => setActiveTab("danger")}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === "danger" ? "text-red-500 border-b-2 border-red-500" : "text-text-secondary"
            }`}
          >
            위험 구역
          </button>
        )}
      </div>

      {activeTab === "general" && project && (
        <GeneralSettingTab project={project} />
      )}

      {activeTab === "team" && project && (
        <TeamSettingTab project={project} additional_data={additional_data} />
      )}

      {activeTab === "danger" && isLeader && (
        <DangerSettingTab />
      )}
    </div>
  )
}