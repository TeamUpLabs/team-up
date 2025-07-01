"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { Info } from "lucide-react";

export default function Notification() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [taskNotification, setTaskNotification] = useState(true);
  const [milestoneNotification, setMilestoneNotification] = useState(true);
  const [deadlineNotification, setDeadlineNotification] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [pushNotification, setPushNotification] = useState(true);
  const [securityNotification, setSecurityNotification] = useState(true);

  const handleEmailToggle = (name: string, checked: boolean) => {
    if (name === 'emailEnabled') {
      setEmailEnabled(checked);
    }
    if (name === 'emailEnabled' && !checked) {
      setTaskNotification(false);
      setMilestoneNotification(false);
      setDeadlineNotification(false);
      setWeeklyReport(false);
    }

    if (name === 'emailEnabled' && checked) {
      setTaskNotification(true);
      setMilestoneNotification(true);
      setDeadlineNotification(true);
      setWeeklyReport(true);
    }

    if (name === 'taskNotification') {
      if (emailEnabled === false) {
        setEmailEnabled(true);
      }
      setTaskNotification(checked);
    }

    if (name === 'milestoneNotification') {
      if (emailEnabled === false) {
        setEmailEnabled(true);
      }
      setMilestoneNotification(checked);
    }

    if (name === 'deadlineNotification') {
      if (emailEnabled === false) {
        setEmailEnabled(true);
      }
      setDeadlineNotification(checked);
    }

    if (name === 'weeklyReport') {
      if (emailEnabled === false) {
        setEmailEnabled(true);
      }
      setWeeklyReport(checked);
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-component-border rounded-lg px-6">
      <div className="divide-y divide-component-border">
        <div className="flex flex-col gap-4 py-6">
          <h2 className="text-lg font-semibold text-text-secondary">이메일 알림</h2>
          <Switch
            checked={emailEnabled}
            onChange={() => handleEmailToggle('emailEnabled', !emailEnabled)}
            label="Email 알림"
            description="Email 알림을 받을 수 있습니다."
            className="justify-between"
          />
          <Switch
            checked={taskNotification}
            onChange={() => handleEmailToggle('taskNotification', !taskNotification)}
            label="Task 할당 알림"
            description="Task가 할당되면 알림을 받을 수 있습니다."
            className="justify-between"
          />
          <Switch
            checked={milestoneNotification}
            onChange={() => handleEmailToggle('milestoneNotification', !milestoneNotification)}
            label="Milestone 할당 알림"
            description="Milestone이 할당되면 알림을 받을 수 있습니다."
            className="justify-between"
          />
          <Switch
            checked={deadlineNotification}
            onChange={() => handleEmailToggle('deadlineNotification', !deadlineNotification)}
            label="마감 임박 알림"
            description="다가오는 마감일에 알림을 받을 수 있습니다."
            className="justify-between"
          />
          <Switch
            checked={weeklyReport}
            onChange={() => handleEmailToggle('weeklyReport', !weeklyReport)}
            label="주간 보고서"
            description="주간 보고서를 받을 수 있습니다."
            className="justify-between"
          />
        </div>

        <div className="flex flex-col gap-4 py-6">
          <h2 className="text-lg font-semibold text-text-secondary">푸시 알림</h2>
          <Switch
            checked={pushNotification}
            onChange={() => setPushNotification(!pushNotification)}
            label="Push 알림"
            description="Push 알림을 받을 수 있습니다."
            className="justify-between"
          />
        </div>

        <div className="flex flex-col gap-4 py-6">
          <h2 className="text-lg font-semibold text-text-secondary">보안 및 계정</h2>
          <Switch
            checked={securityNotification}
            onChange={() => setSecurityNotification(!securityNotification)}
            label="보안 알림"
            description="보안 관련된 알림을 받을 수 있습니다."
            className="justify-between"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-indigo-400/20 text-indigo-400 p-4 border border-indigo-400/20 rounded-lg">
        <Info className="w-4 h-4" />
        <p className="text-sm">알림 설정은 자동으로 저장됩니다.</p>
      </div>
    </div>
  );
}