"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/auth/authStore';
import { server } from '@/auth/server';

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const exchangeCodeForToken = async () => {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const social = url.searchParams.get("social");
        if (!code || !social) return;

        // Use relative URL that will be proxied through Next.js
        const res = await server.get(`/auth/social/${social}/callback?code=${code}`, {
          withCredentials: true,
        });
        const data = res.data;

        console.log(res);

        if (data.status === "logged_in") {
          useAuthStore.getState().setToken(data.access_token);
          useAuthStore.getState().setUser(data.user_info);
          useAuthStore.getState().setAlert("로그인 성공", "success");
          window.location.href = "/";
        } else if (data.status === "need_additional_info") {
          // Redirect to additional info page
          localStorage.setItem("partial_user", JSON.stringify(data.user_info));
          router.push(`/auth/extra-info?social=${social}`);
        }
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