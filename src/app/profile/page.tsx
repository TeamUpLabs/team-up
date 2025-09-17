"use client";

import { useState, useEffect } from "react";
import TabSlider from "@/components/ui/TabSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import PersonalInfo from "@/components/platform/profile/PersonalInfo";
// import MyPosts from "@/components/platform/profile/MyPosts";
import Preference from "@/components/platform/profile/Preference";
import Security from "@/components/platform/profile/Security";
import Notification from "@/components/platform/profile/Notification";
import useSWR from "swr";
import useAuthHydration from "@/hooks/useAuthHydration";
import { fetcher } from "@/auth/server";
import { useAuthStore } from "@/auth/authStore";
import { User, blankUser } from "@/types/user/User";

type ProfileTab = 'personal-info' | 'preference' | 'security' | 'notifications';

const profileTabs: Record<ProfileTab, { label: string }> = {
  'personal-info': {
    label: '개인 정보',
  },
  // 'posts': {
  //   label: '게시글',
  // },
  'preference': {
    label: '선호도',
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

  const { data: userData, error, isLoading } = useSWR<User>(
    hydrated && token ? `${useAuthStore.getState().user?.links.self.href}` : null,
    (url: string) => fetcher(url)
  );
  
  const [user, setUser] = useState<User>(blankUser);
  
  // Update local state when userData changes
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

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
      {selectedTab === 'personal-info' && <PersonalInfo user={user || blankUser} setUser={setUser} />}
      {/* {selectedTab === 'posts' && <MyPosts posts={user.posts} />} */}
      {selectedTab === 'preference' && <Preference user={user || blankUser} setUser={setUser} />}
      {selectedTab === 'security' && <Security user={user || blankUser} />}
      {selectedTab === 'notifications' && <Notification notificationSettings={user?.notification_settings || blankUser.notification_settings} setUser={setUser} />}
    </div>
  );
}