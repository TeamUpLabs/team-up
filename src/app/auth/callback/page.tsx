"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/auth/authStore';

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const exchangeCodeForToken = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const social = url.searchParams.get("social");
      if (!code || !social) return;
      console.log(code, social);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback?social=${social}&code=${code}`);
      const data = await res.json();
      console.log(data);

      if (data.access_token) {
        // 로그인 성공 - 토큰 저장 및 리디렉션
        useAuthStore.getState().setToken(data.access_token);
        useAuthStore.getState().setUser(data.user_info);
        useAuthStore.getState().setAlert("로그인 성공", "success");
        router.push("/platform");
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