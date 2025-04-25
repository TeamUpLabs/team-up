"use client";

import { useAuthStore } from "@/auth/authStore";
import { useProject } from "@/contexts/ProjectContext";
import { useState } from "react";
import GeneralSettingTab from "@/components/project/setting/GeneralSettingTab";
import TeamSettingTab from "@/components/project/setting/TeamSettingTab";
import NotificationsSettingTab from "@/components/project/setting/NotificationsSettingTab";
import AppearanceSettingTab from "@/components/project/setting/AppearanceSettingTab";
import PrivacySettingTab from "@/components/project/setting/PrivacySettingTab";
import DangerSettingTab from "@/components/project/setting/DangerSettingTab";

export default function SettingsPage() {
  const { project } = useProject();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("general");

  const isLeader = Array.isArray(project?.leader)
    ? project.leader.some((leader: { id: number | string }) => leader.id === user?.id)
    : project?.leader?.id === user?.id;
    
  // 참여 요청이 있는지 확인
  const hasParticipationRequests = project?.participationRequestMembers && project.participationRequestMembers.length > 0;

  return (
    <div className="py-6 px-2 sm:px-4 md:px-6">
      <div className="flex items-center justify-between mb-8 bg-gray-900/90 p-6 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">설정</h1>
          <p className="text-gray-400 mt-2">프로젝트의 설정을 관리하세요.</p>
        </div>
      </div>

      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 font-medium ${
            activeTab === "general" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
          }`}
        >
          일반
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2 font-medium relative ${
            activeTab === "team" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
          }`}
        >
          팀 관리
          {hasParticipationRequests && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-100"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center">
                {project.participationRequestMembers.length}
              </span>
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 font-medium ${
            activeTab === "notifications" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
          }`}
        >
          알림
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`px-4 py-2 font-medium ${
            activeTab === "appearance" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
          }`}
        >
          테마
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`px-4 py-2 font-medium ${
            activeTab === "privacy" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
          }`}
        >
          개인정보 보호
        </button>
        {isLeader && (
          <button
            onClick={() => setActiveTab("danger")}
            className={`px-4 py-2 font-medium ${
              activeTab === "danger" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400"
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
        <TeamSettingTab project={project} />
      )}

      {activeTab === "notifications" && (
        <NotificationsSettingTab />
      )}

      {activeTab === "appearance" && (
        <AppearanceSettingTab />
      )}

      {activeTab === "privacy" && (
        <PrivacySettingTab />
      )}

      {activeTab === "danger" && isLeader && (
        <DangerSettingTab />
      )}
    </div>
  )
}