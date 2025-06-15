'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/auth/authStore';
import { server } from '@/auth/server';
import { getCurrentKoreanTime } from '@/utils/dateUtils';

export default function AuthCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');

  const handleLogin = useCallback(async () => {
    if (!token) {
      useAuthStore.getState().setAlert('인증 토큰이 없습니다.', 'error');
      router.push('/signin');
      return;
    }

    useAuthStore.getState().setToken(token);

    try {
      const userRes = await server.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userRes.data) {
        throw new Error('사용자 정보를 가져오지 못했습니다.');
      }

      const user = userRes.data;
      await server.put(`/member/${user.id}`, {
        status: '활성',
        lastLogin: getCurrentKoreanTime(),
      });

      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setAlert('로그인 성공', 'success');
      router.push('/platform');
    } catch (error) {
      console.error('로그인 처리 중 오류 발생:', error);
      useAuthStore.getState().logout();
      useAuthStore.getState().setAlert('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
      router.push('/signin');
    }
  }, [token, router]);

  useEffect(() => {
    handleLogin();
  }, [handleLogin]);

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