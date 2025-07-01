"use client";

import { Input } from "@/components/ui/Input";
import { Lock, Smartphone, Laptop, Check, X } from "lucide-react";
import { useState } from "react";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import Badge from "@/components/ui/Badge";
import { useTheme } from "@/contexts/ThemeContext";

export default function Security() {
  const { isDark } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="flex flex-col gap-4 border border-component-border rounded-lg px-6">
      <div className="divide-y divide-component-border">
        <div className="flex flex-col gap-4 py-6">
          <h2 className="text-lg font-semibold text-text-secondary">비밀번호 변경</h2>
          <Input
            type="password"
            placeholder="현재 비밀번호를 입력해주세요."
            label="현재 비밀번호"
            isRequired={true}
            startAdornment={<Lock className="w-4 h-4 text-text-secondary" />}
            isPassword={true}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="새 비밀번호를 입력해주세요."
            label="새 비밀번호"
            isRequired={true}
            startAdornment={<Lock className="w-4 h-4 text-text-secondary" />}
            isPassword={true}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="새 비밀번호를 확인해주세요."
            label="새 비밀번호 확인"
            isRequired={true}
            startAdornment={<Lock className="w-4 h-4 text-text-secondary" />}
            isPassword={true}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={newPassword !== confirmPassword ? '비밀번호가 일치하지 않습니다.' : ''}
          />
          <div className="flex justify-end">
            <SubmitBtn
              buttonText="변경하기"
              onClick={() => { }}
              submitStatus="idle"
              fit
              withIcon
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6">
          <h2 className="text-lg font-semibold text-text-secondary mb-4">활성 세션</h2>
          <div className="flex flex-col gap-4">
            <div className="border border-component-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-component-tertiary-background rounded-lg">
                  <Laptop className="w-5 h-5 text-text-primary" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Current Session</p>
                  <p className="text-sm text-text-secondary">Chrome on macOS • New York, USA</p>
                  <p className="text-xs text-text-tertiary">Last active: Now</p>
                </div>
              </div>
              <Badge
                color="green"
                content={
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Current</span>
                  </div>
                }
                isDark={isDark}
              />
            </div>

            <div className="border border-component-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-component-tertiary-background rounded-lg">
                  <Smartphone className="w-5 h-5 text-text-primary" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Mobile App</p>
                  <p className="text-sm text-text-secondary">iPhone • New York, USA</p>
                  <p className="text-xs text-text-tertiary">Last active: 2 hours ago</p>
                </div>
              </div>
              <button 
                onClick={() => {}}
                className="flex cursor-pointer"
              >
                <Badge
                  color="red"
                  content={
                    <div className="flex items-center gap-1">
                      <X className="w-3 h-3" />
                      <span>Revoke</span>
                    </div>
                  }
                  isDark={isDark}
                  isHover
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}