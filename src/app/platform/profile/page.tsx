"use client";

import { useState } from "react";
import TabSlider from "@/components/ui/TabSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import PersonalInfo from "@/components/platform/profile/PersonalInfo";
import Security from "@/components/platform/profile/Security";
import Notification from "@/components/platform/profile/Notification";
import { blankUser } from "@/types/User";
import useSWR from "swr";
import useAuthHydration from "@/hooks/useAuthHydration";
import { fetcher } from "@/auth/server";
import { useAuthStore } from "@/auth/authStore";
import { User } from "@/types/User";

type ProfileTab = 'personal-info' | 'security' | 'notifications';

const profileTabs: Record<ProfileTab, { label: string }> = {
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

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState<ProfileTab>('personal-info');
  const router = useRouter();
  const hydrated = useAuthHydration();
  const token = useAuthStore((state) => state.token);

  const { data: user, error, isLoading } = useSWR<User>(
    hydrated && token ? `/users/me` : null,
    (url: string) => fetcher(url, token || undefined)
  );

  if (error) {
    return <div className="text-center text-text-secondary p-8">프로필 정보를 가져오는 데 실패했습니다.</div>;
  }

  if (isLoading) {
    return <div className="text-center text-text-secondary p-8">로딩 중...</div>;
  }

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
          <h1 className="text-2xl font-bold text-text-primary">{profileTabs[selectedTab].label}</h1>
        </div>
      </div>
      <TabSlider
        tabs={profileTabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab as (tab: string) => void}
        fullWidth
      />
      {selectedTab === 'personal-info' && <PersonalInfo user={user || blankUser} />}
      {selectedTab === 'security' && <Security />}
      {selectedTab === 'notifications' && <Notification />}
    </div>
  );
}