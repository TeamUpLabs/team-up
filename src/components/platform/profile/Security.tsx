"use client";

import { Input } from "@/components/ui/Input";
import { Lock, Smartphone, Laptop, Tablet, Check, X } from "lucide-react";
import { useState } from "react";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import Badge from "@/components/ui/Badge";
import { User } from "@/types/User";
import { updateUserProfile } from "@/hooks/getMemberData";
import { useAuthStore } from "@/auth/authStore";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface SecurityProps {
  user: User;
}

export default function Security({ user }: SecurityProps) {  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      useAuthStore.getState().setAlert("비밀번호가 일치하지 않습니다.", "error");
      return;
    }

    if (newPassword.length < 8) {
      useAuthStore.getState().setAlert("비밀번호는 8자 이상이어야 합니다.", "error");
      return;
    }

    try {
      setSubmitStatus("submitting");
      const response = await updateUserProfile({
        password: newPassword,
      });
      if (response) {
        useAuthStore.getState().setAlert("비밀번호가 변경되었습니다.", "success");
        setSubmitStatus("success");
      }
    } catch (error) {
      console.error(error);
      useAuthStore.getState().setAlert("비밀번호 변경 중 오류가 발생했습니다.", "error");
      setSubmitStatus("error");
    } finally {
      setSubmitStatus("idle");
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-component-border rounded-lg px-6">
      <div className="divide-y divide-component-border">
        <div className="flex flex-col gap-4 py-6">
          <h2 className="text-lg font-semibold text-text-secondary">비밀번호 변경</h2>
          <Input
            type="password"
            placeholder={user.auth_provider !== "local" ? "소셜 로그인을 사용 중이므로 새 비밀번호를 입력할 수 없습니다." : "새 비밀번호를 입력해주세요."}
            label="새 비밀번호"
            isRequired={true}
            startAdornment={<Lock className="w-4 h-4 text-text-secondary" />}
            isPassword={true}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={user.auth_provider !== "local"}
            className="disabled:opacity-70 disabled:cursor-not-allowed"
          />
          <div className="space-y-1">
            <Input
              type="password"
              placeholder={user.auth_provider !== "local" ? "소셜 로그인을 사용 중이므로 새 비밀번호를 확인할 수 없습니다." : "새 비밀번호를 확인해주세요."}
              label="새 비밀번호 확인"
              isRequired={true}
              startAdornment={<Lock className="w-4 h-4 text-text-secondary" />}
              isPassword={true}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={newPassword !== confirmPassword ? '비밀번호가 일치하지 않습니다.' : ''}
              disabled={user.auth_provider !== "local"}
              className="disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex justify-end">
            <SubmitBtn
              buttonText="변경하기"
              onClick={handleChangePassword}
              submitStatus={submitStatus}
              fit
              withIcon
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6">
          <h2 className="text-lg font-semibold text-text-secondary mb-4">활성 세션</h2>
          <div className="flex flex-col gap-4">
            {user.sessions && user.sessions.map((session, idx) => (
              <div key={idx} className="border border-component-border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-component-tertiary-background rounded-lg">
                    {session.device_type === "Mobile" ? (
                      <Smartphone className="w-5 h-5 text-text-primary" />
                    ) : session.device_type === "Tablet" ? (
                      <Tablet className="w-5 h-5 text-text-primary" />
                    ) : (
                      <Laptop className="w-5 h-5 text-text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{session.is_current ? "Current Session" : "Other Session"}</p>
                    <p className="text-sm text-text-secondary">{session.browser} on {session.device} • {session.geo_location}</p>
                    <p className="text-xs text-text-tertiary">Last active: {formatDistanceToNow(session.last_active_at, { addSuffix: true, locale: ko })}</p>
                  </div>
                </div>
                <Badge
                  color={session.is_current ? "green" : "red"}
                  content={
                    <div className="flex items-center gap-1">
                      {session.is_current ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{session.is_current ? "Current" : "Revoke"}</span>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}