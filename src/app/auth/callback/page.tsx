'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/auth/authStore'
import { server } from '@/auth/server'
import { getCurrentKoreanTime } from '@/utils/dateUtils'

export default function AuthCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');

  const handleLogin = useCallback(async () => {
    if (!token) {
      // 토큰이 없는 경우 로그인 페이지로 리디렉션하거나 오류 처리
      useAuthStore.getState().setAlert("인증 토큰이 없습니다.", "error");
      router.push('/signin');
      return;
    }

    useAuthStore.getState().setToken(token);
    
    try {
      const userRes = await server.get('/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userRes.data) {
        throw new Error('사용자 정보를 가져오지 못했습니다.');
      }

      const user = userRes.data;
      await server.put(`/member/${user.id}`, {
        status: "활성",
        lastLogin: getCurrentKoreanTime(),
      });

      console.log(user);

      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setAlert("로그인 성공", "success");
      router.push('/platform');

    } catch (error) {
      console.error("로그인 처리 중 오류 발생:", error);
      useAuthStore.getState().logout();
      useAuthStore.getState().setAlert("로그인에 실패했습니다. 다시 시도해주세요.", "error");
      router.push('/signin');
    }
  }, [token, router]);

  useEffect(() => {
    handleLogin();
  }, [handleLogin])

  return <p>로그인 처리 중...</p>
}