"use client";

import { useState } from "react";
import TabSlider from "@/components/ui/TabSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import PersonalInfo from "@/components/platform/profile/PersonalInfo";
import Security from "@/components/platform/profile/Security";
import { useAuthStore } from "@/auth/authStore";
import { Member } from "@/types/Member";

const profileTabs = {
  'personal-info': {
    label: '개인 정보',
  },
  'security': {
    label: '보안',
  },
  'notifications': {
    label: '알림',
  },
};

const blankUser: Member = {
  id: 0,
  name: '',
  email: '',
  role: '',
  currentTask: [],
  status: '',
  lastLogin: new Date().toISOString(),
  createdAt: new Date().toISOString(),
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
    timezone: '',
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
  signupMethod: 'local',
};

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState('personal-info');
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-component-secondary-background hover:bg-component-tertiary-background border border-component-border text-text-secondary transition-colors"
            aria-label="뒤로 가기"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-text-primary">내 프로필</h1>
        </div>
      </div>
      <TabSlider
        tabs={profileTabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        fullWidth
      />
      {selectedTab === 'personal-info' && <PersonalInfo user={user || blankUser} />}
      {selectedTab === 'security' && <Security />}
    </div>
  );
}