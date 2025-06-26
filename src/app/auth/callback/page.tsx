"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/auth/authStore';
import { server } from '@/auth/server';
import { getCurrentKoreanTime } from '@/utils/dateUtils';

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const exchangeCodeForToken = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const social = url.searchParams.get("social");
      if (!code || !social) return;

      const res = await server.get(`/auth/callback?social=${social}&code=${code}`);
      const data = res.data;

      if (data.access_token) {
        try {
          const res = await server.put(`/member/${data.user_info.id}`, {
            status: "활성",
            lastLogin: getCurrentKoreanTime()
          });
          if (res.status === 200) {
            useAuthStore.getState().setToken(data.access_token);
            useAuthStore.getState().setUser(data.user_info);
            useAuthStore.getState().setAlert("로그인 성공", "success");
            window.location.href = '/';
          } else {
            throw new Error('Failed to update user status');
          }
        } catch (error: unknown) {
          console.error("Failed to update user status:", error);
          useAuthStore.getState().logout();
          useAuthStore.getState().setAlert("Status를 업데이트하는데 실패했습니다.", "error");
        }
      } else if (data.status === "need_additional_info") {
        // 추가 정보 입력 페이지로 이동
        localStorage.setItem("partial_user", JSON.stringify(data.user_info));
        router.push(`/auth/extra-info?social=${social}`);
      }
    };

    exchangeCodeForToken();
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-xl font-semibold text-text-primary">
          로그인 중입니다. 잠시만 기다려주세요...
        </p>
      </div>
    </div>
  );
}